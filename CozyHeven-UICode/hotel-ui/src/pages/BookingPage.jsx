import { useState, useRef } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import axios from "axios"
import "../styles/pages.css"
import "../styles/components.css"

const BASE = "http://localhost:8080"

const emptyAdult = () => ({ name: "", age: "", gender: "", address: "", phone: "", aadhaar: null, isChild: false })
const emptyChild = () => ({ name: "", age: "", gender: "", address: "", aadhaar: null, isChild: true })

/*
 * DISCOUNT FRACTION — matches FareCalculatorService.discountFraction() exactly
 *   under 5  → 1.00  (free)
 *   5–11     → 0.50  (50% off)
 *   12–17    → 0.25  (25% off)
 *   18+      → 0.00  (adult)
 */
const childDiscountFraction = (age) => {
  const a = Number(age)
  if (!a || a < 5)  return 1.0
  if (a <= 11)      return 0.5
  if (a <= 17)      return 0.25
  return 0
}

const childLabel = (age) => {
  const a = Number(age)
  if (!a || a < 5)  return "Free (Under 5)"
  if (a <= 11)      return "50% off (Age 5–11)"
  return "25% off (Age 12–17)"
}

const AadhaarUpload = ({ file, onChange, label = "Upload Aadhaar *" }) => {
  const ref = useRef()
  return (
    <div className="form-group">
      <label className="lbl">{label}</label>
      <div
        onClick={() => ref.current.click()}
        style={{
          border: "1.5px dashed var(--gold)", borderRadius: 8,
          padding: "10px 14px", cursor: "pointer",
          background: file ? "var(--green-bg)" : "var(--gold-bg)",
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, color: "var(--ink)",
        }}
      >
        <span style={{ fontSize: 18 }}>{file ? "✅" : "📄"}</span>
        <span>{file ? file.name : "Click to upload Aadhaar (PDF/JPG/PNG)"}</span>
      </div>
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }}
        onChange={e => onChange(e.target.files[0] || null)} />
      {file && (
        <div style={{ fontSize: 11, color: "var(--green)", marginTop: 4 }}>
          ✓ {file.name} ({(file.size / 1024).toFixed(0)} KB)
        </div>
      )}
    </div>
  )
}

const BookingPage = () => {
  const { roomId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const checkin       = searchParams.get("checkin")   || ""
  const checkout      = searchParams.get("checkout")  || ""
  const adults        = Number(searchParams.get("adults"))   || 1
  const children      = Number(searchParams.get("children")) || 0
  const pricePerNight = Number(searchParams.get("price"))    || 0
  const hotelName     = searchParams.get("hotelName")
    ? decodeURIComponent(searchParams.get("hotelName")) : "Your Hotel"

  const totalGuests = adults + children

  const nights = (() => {
    if (!checkin || !checkout) return 1
    const d = Math.round((new Date(checkout) - new Date(checkin)) / 86400000)
    return d > 0 ? d : 1
  })()

  const [guests,  setGuests]  = useState([
    ...Array.from({ length: adults },   emptyAdult),
    ...Array.from({ length: children }, emptyChild),
  ])
  const [errMsg,  setErrMsg]  = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const changeGuest   = (idx, field, val) => {
    const u = [...guests]
    u[idx] = { ...u[idx], [field]: field === "age" ? Number(val) : val }
    setGuests(u)
  }
  const changeAadhaar = (idx, file) => {
    const u = [...guests]; u[idx] = { ...u[idx], aadhaar: file }; setGuests(u)
  }
  const addGuest = (isChild = false) => {
    if (guests.length >= totalGuests) { setErrMsg(`Max ${totalGuests} guest(s).`); return }
    setGuests(g => [...g, isChild ? emptyChild() : emptyAdult()])
  }
  const removeGuest = idx => {
    if (guests.length <= 1) return
    setGuests(g => g.filter((_, i) => i !== idx))
  }

  /* ── Price preview (mirrors FareCalculatorService exactly) ──
     baseTotal     = price × nights          (full, no per-person split in display)
     sharePerPerson = baseTotal / guestCount  (equal share each)
     totalDiscount  = Σ sharePerPerson × discountFraction  (children only)
     adjustedTotal  = round(baseTotal − totalDiscount)
     taxes          = round(adjustedTotal × 0.12)
     grandTotal     = adjustedTotal + taxes
  */
  const guestCount     = guests.length || 1
  const baseTotal      = pricePerNight * nights
  const sharePerPerson = baseTotal / guestCount
  const totalDiscount  = guests.reduce((s, g) =>
    g.isChild ? s + sharePerPerson * childDiscountFraction(g.age) : s, 0)
  const adjustedTotal  = Math.round(baseTotal - totalDiscount)
  const adjustedTaxes  = Math.round(adjustedTotal * 0.12)
  const grandTotal     = adjustedTotal + adjustedTaxes
  const childGuests    = guests.filter(g => g.isChild)

  const handleConfirm = async () => {
    setErrMsg("")
    if (guests.length > totalGuests) { setErrMsg(`Too many guests. Max ${totalGuests}.`); return }

    for (const [i, g] of guests.entries()) {
      const lbl = g.isChild ? `Child ${i + 1}` : `Guest ${i + 1}`
      if (!g.name.trim())                        { setErrMsg(`${lbl}: full name required.`);   return }
      if (!g.address.trim())                     { setErrMsg(`${lbl}: address required.`);     return }
      if (!g.aadhaar)                            { setErrMsg(`${lbl}: Aadhaar required.`);     return }
      if (!g.isChild && !g.phone.trim())         { setErrMsg(`${lbl}: phone required.`);       return }
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")

      /* Step 1 — upload Aadhaar files one by one */
      const aadhaarPaths = []
      for (const [i, g] of guests.entries()) {
        const lbl = g.isChild ? `Child ${i + 1}` : `Guest ${i + 1}`
        try {
          const fd = new FormData()
          fd.append("file", g.aadhaar)
          // ⚠️ Do NOT set Content-Type — browser sets multipart boundary automatically
          const res = await axios.post(`${BASE}/api/document/upload`, fd, {
            headers: { Authorization: "Bearer " + token },
          })
          const fileName = res.data.profileImage
          if (!fileName) throw new Error("No filename returned from server")
          aadhaarPaths.push(fileName)
        } catch (e) {
          setErrMsg(`Aadhaar upload failed for ${lbl}: ` + (e.response?.data?.message || e.message))
          setLoading(false)
          return
        }
      }

      /* Step 2 — submit booking (backend - the price via FareCalculatorService) */
      await axios.post(`${BASE}/api/booking/add`, {
        roomId:      Number(roomId),
        checkIn:     checkin,
        checkOut:    checkout,
        adults,
        children,
        totalPeople: totalGuests,
        guests: guests.map((g, i) => ({
          name:        g.name,
          age:         Number(g.age) || 0,
          gender:      g.gender || null,
          address:     g.address,
          phone:       g.isChild ? null : g.phone,
          aadhaarPath: aadhaarPaths[i],
        })),
      
      }, { headers: { Authorization: "Bearer " + token } })

      setSuccess(true)
    } catch (err) {
      setErrMsg(err.response?.data?.message || err.response?.data?.error || "Booking failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page-fade" style={{ maxWidth: 640, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px", border: "2px solid var(--green)" }}>✓</div>
        <h2 className="section-h" style={{ fontSize: 30 }}>Booking Confirmed!</h2>
        <p style={{ fontSize: 15, color: "var(--muted)", margin: "12px 0 32px", lineHeight: 1.7 }}>
          Your stay at <strong>{hotelName}</strong> has been confirmed for {nights} night{nights !== 1 ? "s" : ""}.<br />
          <span style={{ fontSize: 13 }}>Check "My Bookings" for the final price breakdown.</span>
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn-primary"   style={{ padding: "13px 28px" }} onClick={() => navigate("/my-bookings")}>View My Bookings</button>
          <button className="btn-secondary" style={{ padding: "12px 24px" }} onClick={() => navigate("/hotels")}>Browse More Hotels</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-fade">
      <div style={{ background: "var(--ink)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "22px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn-ghost-white" onClick={() => navigate(-1)}>← Back</button>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--white)" }}>Complete Your Booking</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 2 }}>{hotelName} · Room #{roomId}</div>
          </div>
        </div>
      </div>

      <div className="booking-simple-wrap">
        <div>
          {errMsg && <div className="alert alert-danger">{errMsg}</div>}

          {/* Trip pill */}
          <div className="booking-trip-pill">
            {[["Check-in", checkin || "—"], ["Check-out", checkout || "—"], ["Nights", nights], ["Guests", totalGuests]].map(([k, v]) => (
              <div key={k}><div className="booking-trip-item-label">{k}</div><div className="booking-trip-item-val">{v}</div></div>
            ))}
          </div>

          <div style={{ background: "var(--gold-bg)", border: "1px solid var(--gold)", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "var(--ink)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span>ℹ️</span>
            <span>
              Booking for <strong>{adults} adult{adults !== 1 ? "s" : ""}</strong>
              {children > 0 && <> & <strong>{children} child{children !== 1 ? "ren" : ""}</strong></>}.{" "}
              {guests.length < totalGuests && <span style={{ color: "var(--gold)", fontWeight: 600 }}>Add {totalGuests - guests.length} more guest(s).</span>}
              {guests.length === totalGuests && <span style={{ color: "var(--green)", fontWeight: 600 }}>✓ All guests added.</span>}
            </span>
          </div>

          <div className="booking-form-card">
            <div className="booking-card-h">
              👤 Guest Details
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, fontWeight: 400, color: "var(--muted)", marginLeft: 10 }}>
                ({guests.length} / {totalGuests})
              </span>
            </div>

            {guests.map((g, idx) => (
              <div key={idx} className="guest-block">
                <div className="guest-block-head">
                  <span className="guest-block-n" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {g.isChild ? "🧒" : "👤"} {g.isChild ? `Child ${idx + 1}` : `Adult ${idx + 1}`}
                    {g.isChild && g.age !== "" && (
                      <span style={{ fontSize: 11, background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green)", borderRadius: 20, padding: "2px 8px" }}>
                        {childLabel(g.age)}
                      </span>
                    )}
                  </span>
                  {guests.length > 1 && (
                    <button className="btn-danger" style={{ padding: "5px 12px", fontSize: 11 }} onClick={() => removeGuest(idx)}>Remove</button>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="lbl">Full Name *</label>
                    <input className="input" placeholder={g.isChild ? "Child's full name" : "Aarav Sharma"} value={g.name} onChange={e => changeGuest(idx, "name", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="lbl">Age {g.isChild ? "*" : ""}</label>
                    {g.isChild ? (
                      <select className="input" value={g.age} onChange={e => changeGuest(idx, "age", e.target.value)}>
                        <option value="">Select age</option>
                        {Array.from({ length: 18 }, (_, a) => <option key={a} value={a}>{a === 0 ? "Under 1" : `${a} yr`}</option>)}
                      </select>
                    ) : (
                      <input className="input" type="number" min={18} placeholder="28" value={g.age} onChange={e => changeGuest(idx, "age", e.target.value)} />
                    )}
                  </div>
                  <div className="form-group">
                    <label className="lbl">Gender</label>
                    <select className="input" value={g.gender} onChange={e => changeGuest(idx, "gender", e.target.value)}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  {!g.isChild && (
                    <div className="form-group">
                      <label className="lbl">Phone *</label>
                      <input className="input" placeholder="+91 98765 43210" value={g.phone} onChange={e => changeGuest(idx, "phone", e.target.value)} />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="lbl">Address *</label>
                  <input className="input" placeholder="123, MG Road, Bangalore 560001" value={g.address} onChange={e => changeGuest(idx, "address", e.target.value)} />
                </div>

                <AadhaarUpload file={g.aadhaar} onChange={file => changeAadhaar(idx, file)} label={g.isChild ? "Upload Child's Aadhaar *" : "Upload Aadhaar *"} />
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
              {guests.filter(g => !g.isChild).length < adults && (
                <button className="btn-secondary" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => addGuest(false)}>+ Add Adult</button>
              )}
              {guests.filter(g => g.isChild).length < children && (
                <button className="btn-secondary" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => addGuest(true)}>+ Add Child</button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-primary" style={{ flex: 1, padding: "16px", fontSize: 15 }} onClick={handleConfirm} disabled={loading}>
              {loading ? "Uploading & Confirming…" : "✓ Confirm Booking"}
            </button>
            <button className="btn-ghost" style={{ padding: "16px 24px" }} onClick={() => navigate(-1)}>Cancel</button>
          </div>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
            🔒 256-bit SSL encrypted · Your payment and data is secure
          </div>
        </div>

        {/* Price summary */}
        <div className="booking-summary-sticky">
          <div className="booking-summary-card" style={{ position: "static" }}>
            <span className="section-tag">Price Summary</span>
            <div className="summary-hotel-name" style={{ marginBottom: 4 }}>{hotelName}</div>
            <div className="summary-hotel-loc">Room #{roomId}</div>
            <div className="divider" />

            {pricePerNight > 0 ? (
              <>
                <div className="trow">
                  <span className="tkey">₹{pricePerNight.toLocaleString("en-IN")} × {nights}N × {guestCount} guest{guestCount !== 1 ? "s" : ""}</span>
                  <span className="tval">₹{baseTotal.toLocaleString("en-IN")}</span>
                </div>
                {childGuests.map((g, i) => {
                  const saving = Math.round(sharePerPerson * childDiscountFraction(g.age))
                  if (!saving) return null
                  return (
                    <div key={i} className="trow">
                      <span className="tkey" style={{ color: "var(--green)" }}>Child discount ({g.name || `Child ${i + 1}`})</span>
                      <span className="tval" style={{ color: "var(--green)" }}>−₹{saving.toLocaleString("en-IN")}</span>
                    </div>
                  )
                })}
                {totalDiscount > 0 && (
                  <div className="trow">
                    <span className="tkey" style={{ color: "var(--green)", fontWeight: 600 }}>Adjusted subtotal</span>
                    <span className="tval" style={{ color: "var(--green)", fontWeight: 600 }}>₹{adjustedTotal.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="trow">
                  <span className="tkey">GST (12%)</span>
                  <span className="tval">₹{adjustedTaxes.toLocaleString("en-IN")}</span>
                </div>
                <div className="summary-total-row">
                  <span className="summary-total-label">Total (incl. GST)</span>
                  <span className="price-big">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0", color: "var(--muted)", fontSize: 13 }}>Confirm booking to see final price</div>
            )}

            <div className="divider" />
            <div className="trow"><span className="tkey">Check-in</span><span className="tval">{checkin || "—"}</span></div>
            <div className="trow"><span className="tkey">Check-out</span><span className="tval">{checkout || "—"}</span></div>
            <div className="trow"><span className="tkey">Duration</span><span className="tval">{nights} night{nights !== 1 ? "s" : ""}</span></div>
            <div className="trow"><span className="tkey">Adults</span><span className="tval">{adults}</span></div>
            {children > 0 && <div className="trow"><span className="tkey">Children</span><span className="tval">{children}</span></div>}
            {children > 0 && (
              <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--green-bg)", borderRadius: 8, fontSize: 11, color: "var(--green)", lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>🧒 Child Pricing</div>
                <div>Under 5 → <strong>Free</strong></div>
                <div>Age 5–11 → <strong>50% off</strong></div>
                <div>Age 12–17 → <strong>25% off</strong></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage