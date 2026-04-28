import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import axios from "axios"
import "../styles/pages.css"
import "../styles/components.css"

const BASE = "http://localhost:8080"

const GRADIENTS = [
  "linear-gradient(135deg,#DDD0B0,#C4B090)",
  "linear-gradient(135deg,#B0C8D0,#8AAAB8)",
  "linear-gradient(135deg,#E8D8B8,#D4BC90)",
  "linear-gradient(135deg,#D0C0E0,#B8A0C8)",
]

const BED_TYPES = ["ALL", "KING", "QUEEN", "DOUBLE", "SINGLE", "TWIN"]
const AC_TYPES  = ["ALL", "CENTRAL", "SPLIT", "NONE"]
const AC_LABELS = { ALL: "All Types", CENTRAL: "Central AC", SPLIT: "Split AC", NONE: "Non-AC" }

const RoomsPage = ({ onOpenAuth }) => {
  const { hotelId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [rooms,    setRooms]    = useState([])
  const [hotel,    setHotel]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)

  const [bedFilter, setBedFilter] = useState("ALL")
  const [acFilter,  setAcFilter]  = useState("ALL")
  const [maxPrice,  setMaxPrice]  = useState(50000)

  const checkin  = searchParams.get("checkin")  || ""
  const checkout = searchParams.get("checkout") || ""
  const adults   = Number(searchParams.get("adults"))   || 2
  const children = Number(searchParams.get("children")) || 0

  const nights = (() => {
    if (!checkin || !checkout) return 1
    const d = Math.round((new Date(checkout) - new Date(checkin)) / 86400000)
    return d > 0 ? d : 1
  })()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [roomsRes, hotelRes] = await Promise.all([
          axios.get(`${BASE}/api/room/${hotelId}/rooms/v1`),
          axios.get(`${BASE}/api/hotel/get/${hotelId}`),
        ])
        setRooms((roomsRes.data) ? roomsRes.data : [])
        setHotel(hotelRes.data)
      } catch {
        navigate("/hotels")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [hotelId])

  const resetFilter = () => {
    setBedFilter("ALL"); setAcFilter("ALL"); setMaxPrice(50000)
    axios.get(`${BASE}/api/room/${hotelId}/rooms/v1`)
      .then(r => { setRooms((r.data) ? r.data : []); setSelected(null) })
      .catch(() => {})
  }

  const displayed = rooms.filter(r => {
    if (bedFilter !== "ALL" && r.bedType !== bedFilter) return false
    if (acFilter  !== "ALL" && r.acType  !== acFilter)  return false
    if (Number(r.basePrice) > maxPrice) return false
    return true
  })

  

  const handleBook = (room) => {
    const token = localStorage.getItem("token")

    // Build the full booking URL with all query params preserved
    const bookingUrl = `/book/${room.roomId}?checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}&price=${room.basePrice}&hotelName=${encodeURIComponent(hotel?.hotelName || "")}`

    if (!token) {
      // Pass the intended URL so App.jsx can redirect there after login
      onOpenAuth("login", bookingUrl)
      return
    }

    navigate(bookingUrl)
  }

  const total = selected ? Number(selected.basePrice) * nights : 0
  const taxes = Math.round(total * 0.12)

  return (
    <div className="page-fade">
      {/* Header */}
      <div className="rooms-page-header">
        <div className="rooms-page-header-inner">
          <button className="btn-ghost-white" onClick={() => navigate(`/hotels/${hotelId}?checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}`)}>
            ← Hotel Details
          </button>
          <div>
            <div className="rooms-page-hotel">{hotel?.hotelName || "Available Rooms"}</div>
            {hotel && (
              <div className="rooms-page-sub">
                📍 {hotel.location} · {hotel.ratings}★ · {checkin && checkout ? `${checkin} – ${checkout} · ${nights} night${nights !== 1 ? "s" : ""}` : "Select dates"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rooms-page-body">
        <div>
          {/* Filter bar */}
          <div className="room-filters-bar">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", marginRight: 4 }}>Bed</span>
              {BED_TYPES.map(b => (
                <button key={b} className={`room-filter-chip ${bedFilter === b ? "active" : ""}`} onClick={() => setBedFilter(b)}>
                  {b === "ALL" ? "All Beds" : b}
                </button>
              ))}
            </div>
            <div className="room-filter-divider" />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", marginRight: 4 }}>AC</span>
              {AC_TYPES.map(a => (
                <button key={a} className={`room-filter-chip ${acFilter === a ? "active" : ""}`} onClick={() => setAcFilter(a)}>
                  {AC_LABELS[a]}
                </button>
              ))}
            </div>
            <div className="room-filter-divider" />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>Max Price</span>
              <input
                type="range" min={500} max={50000} step={500}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ accentColor: "var(--gold)", width: 90 }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>₹{maxPrice.toLocaleString("en-IN")}</span>
            </div>
            {(bedFilter !== "ALL" || acFilter !== "ALL" || maxPrice < 50000) && (
              <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={resetFilter}>Clear ✕</button>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="results-count">
              <strong>{displayed.length} room{displayed.length !== 1 ? "s" : ""}</strong> available
            </div>
          </div>

          {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

          {!loading && displayed.length === 0 && (
            <div className="empty-state card" style={{ padding: "48px 24px" }}>
              <div className="empty-icon">🛏️</div>
              <div className="empty-h">No rooms match your filters</div>
              <button className="btn-secondary" style={{ padding: "10px 20px" }} onClick={resetFilter}>Clear filters</button>
            </div>
          )}

          <div className="rooms-list">
            {displayed.map((room, i) => {
              const isAvail    = room.status === "AVAILABLE"
              const isSelected = selected?.roomId === room.roomId
              return (
                <div
                  key={room.roomId}
                  className="room-card"
                  onClick={() => isAvail && setSelected(room)}
                  style={{
                    borderColor: isSelected ? "var(--gold)" : undefined,
                    boxShadow: isSelected ? "0 0 0 2px rgba(181,134,42,.2), var(--shadow)" : undefined,
                    cursor: isAvail ? "pointer" : "default",
                  }}
                >
                  <div className="room-card-inner">
                    <div className="room-img" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>🛏️</div>
                    <div className="room-body">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div className="room-name">{room.bedType} Room</div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {isSelected && <span className="badge badge-gold">✓ Selected</span>}
                          <span className={isAvail ? "badge badge-green" : "badge badge-red"}>● {isAvail ? "Available" : "Booked"}</span>
                        </div>
                      </div>
                      <div className="room-meta-row">
                        <div className="room-meta-item">📐 {room.roomSize}</div>
                        <div className="room-meta-item">👥 Max {room.maxPeople} guests</div>
                        <div className="room-meta-item">❄️ {room.acType}</div>
                        <div className="room-meta-item">🛏️ {room.availability} unit{room.availability !== 1 ? "s" : ""} left</div>
                      </div>
                      <div>
                        <span className="chip">🛏️ {room.bedType}</span>
                        <span className="chip">❄️ {room.acType}</span>
                        <span className="chip">👤 {room.maxPeople} pax</span>
                      </div>
                    </div>
                  </div>

                  <div className="room-card-footer">
                    <div>
                      <div className={isAvail ? "room-status-ok" : "room-status-no"}>
                        {isAvail ? "✓ Available to book" : "✗ Unavailable"}
                      </div>
                      {isAvail && room.availability <= 3 && (
                        <div className="room-avail-warn">{room.availability} unit(s) remaining!</div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ textAlign: "right" }}>
                        <div className="price-med">₹{Number(room.basePrice).toLocaleString("en-IN")}</div>
                        <div className="tkey">per night</div>
                      </div>
                      <button
                        className="btn-primary"
                        style={{ padding: "10px 20px" }}
                        disabled={!isAvail}
                        onClick={e => { e.stopPropagation(); handleBook(room) }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Booking summary sidebar */}
        <div className="booking-summary-card" style={{ position: "sticky", top: 80 }}>
          <span className="section-tag">Booking Summary</span>
          <div className="summary-hotel-name">{hotel?.hotelName}</div>
          <div className="summary-hotel-loc">📍 {hotel?.location}</div>
          <div className="divider" />
          {[
            { k: "Check-in",  v: checkin  || "—" },
            { k: "Check-out", v: checkout || "—" },
            { k: "Duration",  v: `${nights} night${nights !== 1 ? "s" : ""}` },
            { k: "Guests",    v: `${adults} Adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}` },
          ].map(({ k, v }) => (
            <div key={k} className="trow"><span className="tkey">{k}</span><span className="tval">{v}</span></div>
          ))}
          <div className="divider" />
          {selected ? (
            <>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>
                {selected.bedType} Room
              </div>
              <div className="trow">
                <span className="tkey">₹{Number(selected.basePrice).toLocaleString("en-IN")} × {nights} nights</span>
                <span className="tval">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="trow">
                <span className="tkey">Taxes & fees (12%)</span>
                <span className="tval">₹{taxes.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-total-row">
                <span className="summary-total-label">Total</span>
                <span className="price-big">₹{(total + taxes).toLocaleString("en-IN")}</span>
              </div>
              <button className="btn-primary" style={{ width: "100%", padding: "14px" }} onClick={() => handleBook(selected)}>
                Proceed to Booking →
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--muted)", fontSize: 13 }}>
              Select a room to see pricing
            </div>
          )}
          <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--blue-bg)", borderRadius: "var(--r-sm)", border: "1px solid rgba(26,78,128,.15)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", marginBottom: 3 }}>🔒 Secure Booking</div>
            <div style={{ fontSize: 11, color: "var(--blue)", lineHeight: 1.5 }}>256-bit SSL encryption. Instant confirmation guaranteed.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomsPage