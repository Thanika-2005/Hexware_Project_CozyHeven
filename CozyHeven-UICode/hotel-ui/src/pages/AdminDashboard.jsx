import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/pages.css"
import "../styles/components.css"

const BASE = "http://localhost:8080"

const STATUS_CFG = {
  CONFIRMED: { badge: "badge-green", label: "Confirmed", icon: "✅" },
  PENDING:   { badge: "badge-amber", label: "Pending",   icon: "⏳" },
  CANCELLED: { badge: "badge-red",   label: "Cancelled", icon: "❌" },
  REFUNDED:  { badge: "badge-blue",  label: "Refunded",  icon: "💰" },
}

const ROOM_STATUS = {
  AVAILABLE:   { badge: "badge-green",  label: "Available"   },
  OCCUPIED:    { badge: "badge-red",    label: "Occupied"    },
  MAINTENANCE: { badge: "badge-amber",  label: "Maintenance" },
}

const AC_LABELS = { CENTRAL: "Central AC", SPLIT: "Split AC", NONE: "Non-AC" }

const getNights = (ci, co) => {
  if (!ci || !co) return 1
  const d = Math.round((new Date(co) - new Date(ci)) / 86400000)
  return d > 0 ? d : 1
}


const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [])
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      background: "#2d3a2e", color: "#fff", padding: "13px 28px", borderRadius: 40,
      fontSize: 14, fontWeight: 500, boxShadow: "0 6px 32px rgba(0,0,0,.22)", zIndex: 9999,
    }}>{msg}</div>
  )
}

/* ── Add Hotel Modal ── */
const AddHotelModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ hotelName: "", location: "", description: "", ratings: "" })
  const [loading, setLoading] = useState(false)
  const [errMsg,  setErrMsg]  = useState("")
  const token = localStorage.getItem("token")

  const handleSave = async () => {
    if (!form.hotelName.trim()) { setErrMsg("Hotel name required."); return }
    if (!form.location.trim())  { setErrMsg("Location required.");   return }
    setLoading(true); setErrMsg("")
    try {
      await axios.post(`${BASE}/api/hotel/add`,
        { ...form, ratings: Number(form.ratings) },
        { headers: { Authorization: "Bearer " + token } }
      )
      onSaved("Hotel added successfully.")
      onClose()
    } catch (e) {
      setErrMsg(e.response?.data?.message || "Failed to add hotel.")
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">Add <span>Hotel</span></div>
        {errMsg && <div className="alert alert-danger">{errMsg}</div>}
        {[
          { key: "hotelName", label: "Hotel Name *",      type: "text"   },
          { key: "location",  label: "Location *",        type: "text"   },
          { key: "ratings",   label: "Star Rating (1–5)", type: "number" },
        ].map(({ key, label, type }) => (
          <div className="form-group" key={key} style={{ marginBottom: 12 }}>
            <label className="lbl">{label}</label>
            <input className="input" type={type} min={1} max={5} value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
          </div>
        ))}
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="lbl">Description</label>
          <textarea className="textarea" rows={3} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" style={{ flex: 1, padding: "12px" }} onClick={handleSave} disabled={loading}>
            {loading ? "Adding…" : "Add Hotel"}
          </button>
          <button className="btn-secondary" style={{ padding: "12px 20px" }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

const RoomModal = ({ hotelId, room, onClose, onSaved }) => {
  const isEdit = !!room
  const token  = localStorage.getItem("token")

  const [form, setForm] = useState({
    roomSize:     room?.roomSize                       || "",
    bedType:      room?.bedType                        || "KING",
    acType:       room?.acType                         || "CENTRAL",
    status:       room?.status                         || "AVAILABLE",
    basePrice:    room?.basePrice != null ? String(room.basePrice) : "",
    availability: room?.availability != null ? room.availability   : 1,
    maxPeople:    room?.maxPeople   != null ? room.maxPeople        : 2,
  })
  const [loading, setLoading] = useState(false)
  const [errMsg,  setErrMsg]  = useState("")

  const change = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.roomSize.trim())                          return "Room size is required."
    if (!form.basePrice || Number(form.basePrice) <= 0) return "Valid base price required."
    if (Number(form.maxPeople) < 1)                     return "At least 1 guest required."
    if (Number(form.availability) < 0)                  return "Availability cannot be negative."
    return null
  }

  const handleSave = async () => {
    const err = validate()
    if (err) { setErrMsg(err); return }
    setLoading(true); setErrMsg("")

    const payload = {
      RoomId:       isEdit ? room.roomId : 0,   
      roomSize:     form.roomSize.trim(),
      bedType:      form.bedType,               
      acType:       form.acType,                
      status:       form.status,                
      basePrice:    Number(form.basePrice),
      availability: Number(form.availability),
      maxPeople:    Number(form.maxPeople),
    }

    try {
      if (isEdit) {
        await axios.put(`${BASE}/api/room/update/${room.roomId}`, payload,
          { headers: { Authorization: "Bearer " + token } })
      } else {
        await axios.post(`${BASE}/api/room/add/${hotelId}`, payload,
          { headers: { Authorization: "Bearer " + token } })
      }
      onSaved(isEdit ? "Room updated." : "Room added.")
      onClose()
    } catch (e) {
      setErrMsg(e.response?.data?.message || "Failed to save room.")
    } finally { setLoading(false) }
  }

  const statusBadge =
    form.status === "AVAILABLE"   ? "badge badge-green" :
    form.status === "OCCUPIED"    ? "badge badge-red"   :
    "badge badge-amber"

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">{isEdit ? "Edit" : "Add"} <span>Room</span></div>
        {errMsg && <div className="alert alert-danger">{errMsg}</div>}

        <div className="form-grid" style={{ marginBottom: 12 }}>

          <div className="form-group">
            <label className="lbl">Bed Type</label>
            <select className="input" value={form.bedType} onChange={e => change("bedType", e.target.value)}>
              <option value="KING">King</option>
              <option value="QUEEN">Queen</option>
              <option value="DOUBLE">Double</option>
              <option value="SINGLE">Single</option>
              <option value="TWIN">Twin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="lbl">Room Size *</label>
            <input className="input" placeholder="e.g. 300 sq ft" value={form.roomSize}
              onChange={e => change("roomSize", e.target.value)} />
          </div>

          <div className="form-group">
            <label className="lbl">AC Type</label>
            <select className="input" value={form.acType} onChange={e => change("acType", e.target.value)}>
              <option value="CENTRAL">Central AC</option>
              <option value="SPLIT">Split AC</option>
              <option value="NONE">Non-AC</option>
            </select>
          </div>

          {/* STATUS — shown on BOTH add and edit */}
          <div className="form-group">
            <label className="lbl">Room Status</label>
            <select className="input" value={form.status} onChange={e => change("status", e.target.value)}>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label className="lbl">Max Guests</label>
            <input className="input" type="number" min={1} max={20} value={form.maxPeople}
              onChange={e => change("maxPeople", e.target.value)} />
          </div>

          <div className="form-group">
            <label className="lbl">Base Price / Night (₹) *</label>
            <input className="input" type="number" min={1} placeholder="e.g. 3500" value={form.basePrice}
              onChange={e => change("basePrice", e.target.value)} />
          </div>

          <div className="form-group">
            <label className="lbl">Available Units</label>
            <input className="input" type="number" min={0} value={form.availability}
              onChange={e => change("availability", e.target.value)} />
          </div>

        </div>

        {/* Live status preview */}
        <div style={{ marginBottom: 16, padding: "10px 14px", background: "var(--warm)", borderRadius: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ color: "var(--muted)" }}>Status preview:</span>
          <span className={statusBadge}>● {form.status}</span>
          {form.status === "OCCUPIED"    && <span style={{ color: "var(--muted)", fontSize: 12 }}>⚠️ Guests won't be able to book this room.</span>}
          {form.status === "MAINTENANCE" && <span style={{ color: "var(--muted)", fontSize: 12 }}>🔧 Room will be hidden from booking.</span>}
          {form.status === "AVAILABLE"   && <span style={{ color: "var(--muted)", fontSize: 12 }}>✓ Guests can book this room.</span>}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" style={{ flex: 1, padding: "12px" }} onClick={handleSave} disabled={loading}>
            {loading ? "Saving…" : isEdit ? "Update Room" : "Add Room"}
          </button>
          <button className="btn-secondary" style={{ padding: "12px 20px" }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN ADMIN DASHBOARD
══════════════════════════════════════════ */
const AdminDashboard = () => {
  const navigate = useNavigate()
  const token    = localStorage.getItem("token")

  const [tab,           setTab]          = useState("overview")
  const [bookings,      setBookings]     = useState([])
  const [hotels,        setHotels]       = useState([])
  const [loading,       setLoading]      = useState(true)
  const [toast,         setToast]        = useState("")
  const [addHotel,      setAddHotel]     = useState(false)
  const [filterStatus,  setFilterStatus] = useState("ALL")
  const [hotelSearch,   setHotelSearch]  = useState("")
  const [refunding,     setRefunding]    = useState(null)
  const [deletingHotel, setDeletingHotel]= useState(null)
  const [page,          setPage]         = useState(0)
  const [totalPages,    setTotalPages]   = useState(1)

  // Room management
  const [rooms,         setRooms]        = useState([])
  const [selectedHotel, setSelectedHotel]= useState(null)
  const [roomModal,     setRoomModal]    = useState(null)  
  const [deletingRoom,  setDeletingRoom] = useState(null)

  useEffect(() => {
    if (!token) { navigate("/"); return }
    loadAll()
  }, [])

  useEffect(() => { loadBookings() }, [page])

  const loadAll = async () => {
    setLoading(true)
    await Promise.allSettled([loadBookings(), loadHotels()])
    setLoading(false)
  }

  const loadBookings = async () => {
    try {
      const res = await axios.get(`${BASE}/api/booking/get-allBooking?page=${page}&size=10`,
        { headers: { Authorization: "Bearer " + token } })
      setBookings(Array.isArray(res.data.data) ? res.data.data : [])
      setTotalPages(res.data.totalPages || 1)
    } catch { setBookings([]) }
  }

  const loadHotels = async () => {
    try {
      const res = await axios.get(`${BASE}/api/hotel/get-allhotel?page=0&size=100`,
        { headers: { Authorization: "Bearer " + token } })
      setHotels(Array.isArray(res.data.data) ? res.data.data : [])
    } catch { setHotels([]) }
  }

  const loadRooms = async (hotelId) => {
    try {
      const res = await axios.get(`${BASE}/api/room/${hotelId}/rooms`,
        { headers: { Authorization: "Bearer " + token } })
      setRooms(Array.isArray(res.data) ? res.data : [])
    } catch { setRooms([]) }
  }

  
  const handleManageRooms = (hotel) => {
    setSelectedHotel(hotel)
    loadRooms(hotel.hotelId)
    setTab("rooms")
  }

  const handleRefund = async (bookingId) => {
    if (!window.confirm("Issue refund for this booking?")) return
    setRefunding(bookingId)
    try {
      await axios.put(`${BASE}/api/booking/refund/${bookingId}`, {},
        { headers: { Authorization: "Bearer " + token } })
      setBookings(prev => prev.map(b =>
        b.bookingId === bookingId ? { ...b, bookingStatus: "REFUNDED" } : b))
      setToast("Refund issued successfully.")
    } catch (e) {
      setToast(e.response?.data?.message || "Refund failed.")
    } finally { setRefunding(null) }
  }

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm("Delete this hotel and all its data?")) return
    setDeletingHotel(hotelId)
    try {
      await axios.delete(`${BASE}/api/hotel/delete/${hotelId}`,
        { headers: { Authorization: "Bearer " + token } })
      setHotels(prev => prev.filter(h => h.hotelId !== hotelId))
      setToast("Hotel deleted.")
    } catch (e) {
      setToast(e.response?.data?.message || "Could not delete hotel.")
    } finally { setDeletingHotel(null) }
  }

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room permanently?")) return
    setDeletingRoom(roomId)
    try {
      await axios.delete(`${BASE}/api/room/delete/${roomId}`,
        { headers: { Authorization: "Bearer " + token } })
      setRooms(prev => prev.filter(r => r.roomId !== roomId))
      setToast("Room deleted.")
    } catch (e) {
      setToast(e.response?.data?.message || "Could not delete room.")
    } finally { setDeletingRoom(null) }
  }

 
  const totalRevenue = bookings
    .filter(b => b.bookingStatus === "CONFIRMED" || b.bookingStatus === "REFUNDED")
    .reduce((s, b) => {
      const amount = Number(b.totalPrice) || 0
      return b.bookingStatus === "REFUNDED" ? s - amount : s + amount
    }, 0)

  const confirmed = bookings.filter(b => b.bookingStatus === "CONFIRMED").length
  const cancelled = bookings.filter(b => b.bookingStatus === "CANCELLED").length
  const refunded  = bookings.filter(b => b.bookingStatus === "REFUNDED").length

  const statuses      = ["ALL", ...new Set(bookings.map(b => b.bookingStatus))]
  const displayedBks  = filterStatus === "ALL" ? bookings : bookings.filter(b => b.bookingStatus === filterStatus)
  const displayedHtls = hotels.filter(h =>
    h.hotelName?.toLowerCase().includes(hotelSearch.toLowerCase()) ||
    h.location?.toLowerCase().includes(hotelSearch.toLowerCase())
  )

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>

  return (
    <div className="page-fade">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      {addHotel && (
        <AddHotelModal
          onClose={() => setAddHotel(false)}
          onSaved={msg => { setToast(msg); loadHotels() }}
        />
      )}

      {roomModal && (
        <RoomModal
          hotelId={selectedHotel?.hotelId}
          room={roomModal === "add" ? null : roomModal}
          onClose={() => setRoomModal(null)}
          onSaved={msg => { setToast(msg); loadRooms(selectedHotel?.hotelId) }}
        />
      )}

      {/* ── Header ── */}
      <div style={{ background: "var(--ink)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--white)" }}>⚙️ Admin Dashboard</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 2 }}>Full platform management</div>
          </div>
          <button className="btn-ghost-white" onClick={() => navigate("/")}>← Home</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── Stat cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { icon: "🏨", label: "Total Hotels",  value: hotels.length,                              color: "var(--ink)"   },
            { icon: "📋", label: "Total Bookings", value: bookings.length,                            color: "var(--ink)"   },
            { icon: "✅", label: "Confirmed",      value: confirmed,                                  color: "var(--green)" },
            { icon: "❌", label: "Cancelled",      value: cancelled,                                  color: "var(--red)"   },
            { icon: "💰", label: "Refunded",       value: refunded,                                   color: "var(--blue)"  },
            { icon: "💵", label: "Net Revenue",    value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "var(--gold)"  },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'Playfair Display',serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)" }}>
          {[
            ["overview", "📊 Overview"],
            ["bookings", "📋 All Bookings"],
            ["hotels",   "🏨 Hotels"],
            ["rooms",    "🛏️ Rooms"],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: "none",
              borderBottom: tab === key ? "2px solid var(--gold)" : "2px solid transparent",
              color: tab === key ? "var(--gold)" : "var(--muted)", marginBottom: -1,
            }}>{label}</button>
          ))}
        </div>

        {/* ══ OVERVIEW TAB ══ */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            <div className="card" style={{ padding: "20px 24px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Booking Status Breakdown</div>
              {Object.entries(STATUS_CFG).map(([status, cfg]) => {
                const count = bookings.filter(b => b.bookingStatus === status).length
                const pct   = bookings.length ? Math.round((count / bookings.length) * 100) : 0
                return (
                  <div key={status} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span>{cfg.icon} {cfg.label}</span>
                      <span style={{ fontWeight: 600 }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: "var(--warm)", borderRadius: 4 }}>
                      <div style={{ height: 6, borderRadius: 4, background: "var(--gold)", width: `${pct}%`, transition: "width .4s" }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="card" style={{ padding: "20px 24px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Hotels by Bookings</div>
              {(() => {
                const hotelCount = {}
                bookings.forEach(b => { if (b.hotelName) hotelCount[b.hotelName] = (hotelCount[b.hotelName] || 0) + 1 })
                return Object.entries(hotelCount)
                  .sort(([, a], [, b]) => b - a).slice(0, 5)
                  .map(([name, count]) => (
                    <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                      <span>🏨 {name}</span>
                      <span className="badge badge-gold">{count} booking{count !== 1 ? "s" : ""}</span>
                    </div>
                  ))
              })()}
            </div>

          </div>
        )}

        {/* ══ BOOKINGS TAB ══ */}
        {tab === "bookings" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div className="results-count"><strong>{displayedBks.length}</strong> booking{displayedBks.length !== 1 ? "s" : ""}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {statuses.map(s => (
                  <span key={s} className={filterStatus === s ? "chip-active" : "chip chip-clickable"} onClick={() => setFilterStatus(s)}>
                    {s === "ALL" ? `All (${bookings.length})` : `${STATUS_CFG[s]?.label || s} (${bookings.filter(b => b.bookingStatus === s).length})`}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {displayedBks.map(b => {
                const cfg       = STATUS_CFG[b.bookingStatus] || { badge: "badge-gold", label: b.bookingStatus, icon: "📋" }
                const nights    = getNights(b.checkInDate, b.checkOutDate)
                const total     = Number(b.totalPrice) || 0
                const canRefund = b.bookingStatus === "CANCELLED"
                return (
                  <div key={b.bookingId} className="booking-item">
                    <div className="booking-item-header">
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span className="booking-item-id">Booking #{b.bookingId}</span>
                        <span className={`badge ${cfg.badge}`}>{cfg.icon} {cfg.label}</span>
                        {b.hotelName && <span className="chip">🏨 {b.hotelName}</span>}
                      </div>
                      {b.cancellationDate && <span className="tkey">Cancelled: {b.cancellationDate}</span>}
                    </div>
                    <div className="booking-item-body">
                      <div className="booking-item-info">
                        <div className="booking-item-hotel">
                          👤 {b.guestName || "—"}
                          <span className="chip" style={{ marginLeft: 8 }}>✉️ {b.email || "—"}</span>
                        </div>
                        <div className="booking-item-room">
                          {b.bedType  && <span>🛏️ {b.bedType} Room</span>}
                          {b.roomSize && <span style={{ marginLeft: 12 }}>📐 {b.roomSize}</span>}
                          {b.acType   && <span style={{ marginLeft: 12 }}>❄️ {b.acType}</span>}
                        </div>
                        <div className="booking-item-dates">📅 <strong>{b.checkInDate}</strong> → <strong>{b.checkOutDate}</strong> · {nights}N</div>
                      </div>
                      <div className="booking-item-right">
                        <div>
                          <div className="tkey">Total</div>
                          <div className="price-med">{total > 0 ? `₹${total.toLocaleString("en-IN")}` : "—"}</div>
                          {total > 0 && nights > 1 && <div style={{ fontSize: 11, color: "var(--muted)" }}>₹{Math.round(total / nights).toLocaleString("en-IN")}/night</div>}
                        </div>
                        {canRefund && (
                          <button className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12 }} disabled={refunding === b.bookingId} onClick={() => handleRefund(b.bookingId)}>
                            {refunding === b.bookingId ? "Processing…" : "💰 Issue Refund"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
                <button className="btn-secondary" style={{ padding: "9px 18px" }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span className="tkey">Page {page + 1} of {totalPages}</span>
                <button className="btn-secondary" style={{ padding: "9px 18px" }} disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </div>
        )}

        {/* ══ HOTELS TAB ══ */}
        {tab === "hotels" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
              <input className="input" style={{ maxWidth: 300 }} placeholder="🔍 Search hotels or cities…"
                value={hotelSearch} onChange={e => setHotelSearch(e.target.value)} />
              <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => setAddHotel(true)}>+ Add Hotel</button>
            </div>

            <div className="results-count" style={{ marginBottom: 16 }}>
              <strong>{displayedHtls.length}</strong> hotel{displayedHtls.length !== 1 ? "s" : ""}
            </div>

            {displayedHtls.length === 0 && (
              <div className="empty-state card" style={{ padding: "48px 24px" }}>
                <div className="empty-icon">🏨</div>
                <div className="empty-h">No hotels found</div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {displayedHtls.map(h => {
                const hotelBookingCount = bookings.filter(b => b.hotelId === h.hotelId).length
                const hotelRevenue = bookings
                  .filter(b => b.hotelId === h.hotelId && (b.bookingStatus === "CONFIRMED" || b.bookingStatus === "REFUNDED"))
                  .reduce((s, b) => {
                    const amount = Number(b.totalPrice) || 0
                    return b.bookingStatus === "REFUNDED" ? s - amount : s + amount
                  }, 0)

                return (
                  <div key={h.hotelId} className="card" style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                          🏨 {h.hotelName}
                          <span className="badge badge-gold" style={{ marginLeft: 10 }}>{"★".repeat(Math.min(h.ratings || 0, 5))} {h.ratings}</span>
                        </div>
                        <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 8 }}>📍 {h.location}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span className="chip">📋 {hotelBookingCount} booking{hotelBookingCount !== 1 ? "s" : ""}</span>
                          <span className="chip">💰 ₹{hotelRevenue.toLocaleString("en-IN")} revenue</span>
                          {h.amenities?.length > 0 && h.amenities.slice(0, 3).map((a, i) => <span key={i} className="chip">{a.name}</span>)}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {/* Clicking Rooms → loads that hotel's rooms and switches tab */}
                        <button className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12 }} onClick={() => handleManageRooms(h)}>
                          🛏️ Rooms
                        </button>
                        <button className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12 }} onClick={() => navigate(`/hotels/${h.hotelId}`)}>
                          👁️ View
                        </button>
                        <button className="btn-danger" style={{ padding: "8px 14px", fontSize: 12 }} disabled={deletingHotel === h.hotelId} onClick={() => handleDeleteHotel(h.hotelId)}>
                          {deletingHotel === h.hotelId ? "Deleting…" : "🗑️ Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══ ROOMS TAB ══ */}
        {tab === "rooms" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="results-count">
                  <strong>{rooms.length}</strong> room{rooms.length !== 1 ? "s" : ""}
                  {selectedHotel && <span style={{ color: "var(--muted)", fontWeight: 400 }}> · {selectedHotel.hotelName}</span>}
                </div>
                {!selectedHotel && (
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                    Go to <strong>Hotels tab</strong> and click <strong>🛏️ Rooms</strong> on a hotel.
                  </div>
                )}
              </div>
              {selectedHotel && (
                <div style={{ display: "flex", gap: 8 }}>
                  {/* Quick switcher — change hotel without leaving this tab */}
                  <select className="input" style={{ fontSize: 13, padding: "8px 12px" }}
                    value={selectedHotel.hotelId}
                    onChange={e => {
                      const h = hotels.find(h => h.hotelId === Number(e.target.value))
                      if (h) handleManageRooms(h)
                    }}>
                    {hotels.map(h => <option key={h.hotelId} value={h.hotelId}>{h.hotelName}</option>)}
                  </select>
                  <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => setRoomModal("add")}>
                    + Add Room
                  </button>
                </div>
              )}
            </div>

            {!selectedHotel && (
              <div className="empty-state card" style={{ padding: "64px 24px", textAlign: "center" }}>
                <div className="empty-icon">🛏️</div>
                <div className="empty-h">No hotel selected</div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 8, marginBottom: 20 }}>
                  Pick a hotel from the Hotels tab to manage its rooms here.
                </div>
                <button className="btn-secondary" style={{ padding: "10px 20px" }} onClick={() => setTab("hotels")}>
                  → Go to Hotels
                </button>
              </div>
            )}

            {selectedHotel && rooms.length === 0 && (
              <div className="empty-state card" style={{ padding: "48px 24px" }}>
                <div className="empty-icon">🛏️</div>
                <div className="empty-h">No rooms yet for {selectedHotel.hotelName}</div>
                <button className="btn-primary" style={{ padding: "10px 20px", marginTop: 16 }} onClick={() => setRoomModal("add")}>
                  Add First Room
                </button>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {rooms.map(r => {
                const sc = ROOM_STATUS[r.status] || { badge: "badge-gold", label: r.status }
                return (
                  <div key={r.roomId} className="card" style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                          🛏️ {r.bedType} Room
                          <span className={`badge ${sc.badge}`} style={{ marginLeft: 10 }}>● {sc.label}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span className="chip">📐 {r.roomSize}</span>
                          <span className="chip">❄️ {AC_LABELS[r.acType] || r.acType}</span>
                          <span className="chip">👥 Max {r.maxPeople}</span>
                          <span className="chip">🛏️ {r.availability} unit{r.availability !== 1 ? "s" : ""} left</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ textAlign: "right" }}>
                          <div className="price-med">₹{Number(r.basePrice).toLocaleString("en-IN")}</div>
                          <div className="tkey">per night</div>
                        </div>
                        <button className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12 }} onClick={() => setRoomModal(r)}>
                          ✏️ Edit
                        </button>
                        <button className="btn-danger" style={{ padding: "8px 14px", fontSize: 12 }}
                          disabled={deletingRoom === r.roomId} onClick={() => handleDeleteRoom(r.roomId)}>
                          {deletingRoom === r.roomId ? "…" : "🗑️"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translate(-50%,16px); } to { opacity:1; transform:translate(-50%,0); } }
      `}</style>
    </div>
  )
}

export default AdminDashboard