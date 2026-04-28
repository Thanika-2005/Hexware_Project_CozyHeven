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
  AVAILABLE:   { badge: "badge-green", label: "Available"   },
  OCCUPIED:    { badge: "badge-red",   label: "Occupied"    },
  MAINTENANCE: { badge: "badge-amber", label: "Maintenance" },
}

const AC_LABELS = { CENTRAL: "Central AC", SPLIT: "Split AC", NONE: "Non-AC" }

const getNights = (ci, co) => {
  if (!ci || !co) return 1
  const d = Math.round((new Date(co) - new Date(ci)) / 86400000)
  return d > 0 ? d : 1
}

/* ── Toast ── */
const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [])
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      background: "#2d3a2e", color: "#fff", padding: "13px 28px", borderRadius: 40,
      fontSize: 14, fontWeight: 500, boxShadow: "0 6px 32px rgba(0,0,0,.22)", zIndex: 9999,
    }}>
      {msg}
    </div>
  )
}

/* ── Add / Edit Room Modal ── */
const RoomModal = ({ hotelId, room, onClose, onSaved }) => {
  const isEdit = !!room
  const token  = localStorage.getItem("token")

  const [form, setForm] = useState({
    bedType:      room?.bedType      || "KING",
    roomSize:     room?.roomSize     || "",
    acType:       room?.acType       || "CENTRAL",
    status:       room?.status       || "AVAILABLE",  
    maxPeople:    room?.maxPeople    || 2,
    basePrice:    room?.basePrice    || "",
    availability: room?.availability ?? 1,
  })
  const [loading, setLoading] = useState(false)
  const [errMsg,  setErrMsg]  = useState("")

  const change = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.roomSize.trim())                           { setErrMsg("Room size is required.");    return }
    if (!form.basePrice || Number(form.basePrice) <= 0)  { setErrMsg("Valid base price required."); return }
    setLoading(true); setErrMsg("")
    try {
      const payload = {
        RoomId:       isEdit ? room.roomId : 0,
        roomSize:     form.roomSize.trim(),
        bedType:      form.bedType,
        acType:       form.acType,
        status:       form.status,         
        basePrice:    Number(form.basePrice),
        maxPeople:    Number(form.maxPeople),
        availability: Number(form.availability),
      }
      if (isEdit) {
        await axios.put(
          `${BASE}/api/room/update/${room.roomId}`,
          payload,
          { headers: { Authorization: "Bearer " + token } }
        )
      } else {
        await axios.post(
          `${BASE}/api/room/add/${hotelId}`,
          payload,
          { headers: { Authorization: "Bearer " + token } }
        )
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
              {["KING", "QUEEN", "DOUBLE", "SINGLE", "TWIN"].map(b => <option key={b}>{b}</option>)}
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
              {Object.entries(AC_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {/* STATUS — shown on both add and edit */}
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

/* ── Edit Hotel Modal ── */
const EditHotelModal = ({ hotel, onClose, onSaved }) => {
  const [form, setForm] = useState({
    hotelName:   hotel.hotelName   || "",
    location:    hotel.location    || "",
    description: hotel.description || "",
    ratings:     hotel.ratings     || 3,
  })
  const [loading, setLoading] = useState(false)
  const [errMsg,  setErrMsg]  = useState("")
  const token = localStorage.getItem("token")

  const handleSave = async () => {
    if (!form.hotelName.trim()) { setErrMsg("Hotel name required."); return }
    setLoading(true); setErrMsg("")
    try {
      await axios.put(
        `${BASE}/api/hotel/update/${hotel.hotelId}`,
        { ...form, ratings: Number(form.ratings) },
        { headers: { Authorization: "Bearer " + token } }
      )
      onSaved("Hotel details updated.")
      onClose()
    } catch (e) {
      setErrMsg(e.response?.data?.message || "Failed to update hotel.")
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">Edit <span>Hotel</span></div>
        {errMsg && <div className="alert alert-danger">{errMsg}</div>}

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="lbl">Hotel Name *</label>
          <input className="input" value={form.hotelName}
            onChange={e => setForm(f => ({ ...f, hotelName: e.target.value }))} />
        </div>
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="lbl">Location</label>
          <input className="input" value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </div>
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="lbl">Description</label>
          <textarea className="textarea" rows={3} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="lbl">Star Rating (1–5)</label>
          <input className="input" type="number" min={1} max={5} value={form.ratings}
            onChange={e => setForm(f => ({ ...f, ratings: Number(e.target.value) }))} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" style={{ flex: 1, padding: "12px" }} onClick={handleSave} disabled={loading}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
          <button className="btn-secondary" style={{ padding: "12px 20px" }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
const HotelOwnerDashboard = () => {
  const navigate = useNavigate()
  const token    = localStorage.getItem("token")

  const [tab,           setTab]          = useState("bookings")
  const [hotels,        setHotels]       = useState([])
  const [selectedHotel, setSelectedHotel]= useState(null)
  const [bookings,      setBookings]     = useState([])
  const [rooms,         setRooms]        = useState([])
  const [loading,       setLoading]      = useState(true)
  const [toast,         setToast]        = useState("")
  const [roomModal,     setRoomModal]    = useState(null)  // null | "add" | room object
  const [editHotel,     setEditHotel]    = useState(false)
  const [filterStatus,  setFilterStatus] = useState("ALL")
  const [refunding,     setRefunding]    = useState(null)
  const [deletingRoom,  setDeletingRoom] = useState(null)

  useEffect(() => {
    if (!token) { navigate("/login"); return }
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const [hotelsRes, bookingsRes] = await Promise.all([
        axios.get(`${BASE}/api/hotel/my-hotels`,           { headers: { Authorization: "Bearer " + token } }),
        axios.get(`${BASE}/api/booking/my-hotel/bookings`, { headers: { Authorization: "Bearer " + token } }),
      ])

      const hotelList = Array.isArray(hotelsRes.data)   ? hotelsRes.data   : []
      const bks       = Array.isArray(bookingsRes.data)  ? bookingsRes.data : []

      setHotels(hotelList)
      setBookings(bks)

      if (hotelList.length > 0) {
        setSelectedHotel(hotelList[0])
        loadRooms(hotelList[0].hotelId)
      }
    } catch (e) {
      if (e.response?.status === 401 || e.response?.status === 403) navigate("/login")
    } finally { setLoading(false) }
  }

  const loadRooms = async (hotelId) => {
    try {
      const res = await axios.get(`${BASE}/api/room/${hotelId}/rooms`,
        { headers: { Authorization: "Bearer " + token } })
      setRooms(Array.isArray(res.data) ? res.data : [])
    } catch { setRooms([]) }
  }

  const handleHotelSwitch = (hotel) => {
    setSelectedHotel(hotel)
    loadRooms(hotel.hotelId)
    setFilterStatus("ALL")
  }

  const handleRefund = async (bookingId) => {
    if (!window.confirm("Issue refund for this booking?")) return
    setRefunding(bookingId)
    try {
      await axios.put(`${BASE}/api/booking/refund/${bookingId}`, {},
        { headers: { Authorization: "Bearer " + token } })
      setBookings(prev => prev.map(b =>
        b.bookingId === bookingId ? { ...b, bookingStatus: "REFUNDED" } : b))
      setToast("Refund issued.")
    } catch (e) {
      setToast(e.response?.data?.message || "Refund failed.")
    } finally { setRefunding(null) }
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

  /* ── Derived data ── */
  const hotelBookings = bookings.filter(b => b.hotelId === selectedHotel?.hotelId)
  const displayed     = filterStatus === "ALL"
    ? hotelBookings
    : hotelBookings.filter(b => b.bookingStatus === filterStatus)
  const statuses      = ["ALL", ...new Set(hotelBookings.map(b => b.bookingStatus))]

  const confirmed  = hotelBookings.filter(b => b.bookingStatus === "CONFIRMED").length
  const cancelled  = hotelBookings.filter(b => b.bookingStatus === "CANCELLED").length
  const revenue    = hotelBookings
    .filter(b => b.bookingStatus === "CONFIRMED" || b.bookingStatus === "REFUNDED")
    .reduce((s, b) => s + (Number(b.totalPrice) || 0), 0)
  const availRooms = rooms.filter(r => r.status === "AVAILABLE").length

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>

  return (
    <div className="page-fade">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      {roomModal && (
        <RoomModal
          hotelId={selectedHotel?.hotelId}
          room={roomModal === "add" ? null : roomModal}
          onClose={() => setRoomModal(null)}
          onSaved={msg => { setToast(msg); loadRooms(selectedHotel?.hotelId) }}
        />
      )}

      {editHotel && selectedHotel && (
        <EditHotelModal
          hotel={selectedHotel}
          onClose={() => setEditHotel(false)}
          onSaved={msg => { setToast(msg); loadDashboard() }}
        />
      )}

      {/* ── Header ── */}
      <div style={{ background: "var(--ink)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--white)" }}>
              🏨 Owner Dashboard
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 2 }}>
              Manage your hotels, rooms &amp; bookings
            </div>
          </div>
          <button className="btn-ghost-white" onClick={() => navigate("/")}>← Home</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── Hotel selector ── */}
        {hotels.length > 1 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {hotels.map(h => (
              <span
                key={h.hotelId}
                className={selectedHotel?.hotelId === h.hotelId ? "chip-active" : "chip chip-clickable"}
                onClick={() => handleHotelSwitch(h)}
              >
                🏨 {h.hotelName}
              </span>
            ))}
          </div>
        )}

        {/* ── Stat cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { icon: "📋", label: "Total Bookings",  value: hotelBookings.length,                        color: "var(--ink)"   },
            { icon: "✅", label: "Confirmed",        value: confirmed,                                   color: "var(--green)" },
            { icon: "❌", label: "Cancelled",        value: cancelled,                                   color: "var(--red)"   },
            { icon: "💰", label: "Revenue",          value: `₹${revenue.toLocaleString("en-IN")}`,       color: "var(--gold)"  },
            { icon: "🛏️", label: "Available Rooms",  value: `${availRooms} / ${rooms.length}`,           color: "var(--blue)"  },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Playfair Display',serif" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)" }}>
          {[["bookings", "📋 Bookings"], ["rooms", "🛏️ Rooms"], ["hotel", "🏨 Hotel Info"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: "none",
              borderBottom: tab === key ? "2px solid var(--gold)" : "2px solid transparent",
              color: tab === key ? "var(--gold)" : "var(--muted)", marginBottom: -1,
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ══ BOOKINGS TAB ══ */}
        {tab === "bookings" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div className="results-count">
                <strong>{displayed.length}</strong> booking{displayed.length !== 1 ? "s" : ""}
                {selectedHotel ? ` · ${selectedHotel.hotelName}` : ""}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {statuses.map(s => (
                  <span key={s} className={filterStatus === s ? "chip-active" : "chip chip-clickable"} onClick={() => setFilterStatus(s)}>
                    {s === "ALL"
                      ? `All (${hotelBookings.length})`
                      : `${STATUS_CFG[s]?.label || s} (${hotelBookings.filter(b => b.bookingStatus === s).length})`}
                  </span>
                ))}
              </div>
            </div>

            {displayed.length === 0 && (
              <div className="empty-state card" style={{ padding: "48px 24px" }}>
                <div className="empty-icon">📋</div>
                <div className="empty-h">No bookings found</div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {displayed.map(b => {
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
                        <div className="booking-item-dates">
                          📅 <strong>{b.checkInDate}</strong> → <strong>{b.checkOutDate}</strong> · {nights}N
                        </div>
                      </div>
                      <div className="booking-item-right">
                        <div>
                          <div className="tkey">Total</div>
                          <div className="price-med">{total > 0 ? `₹${total.toLocaleString("en-IN")}` : "—"}</div>
                          {total > 0 && nights > 1 && (
                            <div style={{ fontSize: 11, color: "var(--muted)" }}>
                              ₹{Math.round(total / nights).toLocaleString("en-IN")}/night
                            </div>
                          )}
                        </div>
                        {canRefund && (
                          <button className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12 }}
                            disabled={refunding === b.bookingId} onClick={() => handleRefund(b.bookingId)}>
                            {refunding === b.bookingId ? "Processing…" : "💰 Refund"}
                          </button>
                        )}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div className="results-count">
                <strong>{rooms.length}</strong> room{rooms.length !== 1 ? "s" : ""} · {selectedHotel?.hotelName}
              </div>
              <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => setRoomModal("add")}>
                + Add Room
              </button>
            </div>

            {rooms.length === 0 && (
              <div className="empty-state card" style={{ padding: "48px 24px" }}>
                <div className="empty-icon">🛏️</div>
                <div className="empty-h">No rooms yet</div>
                <button className="btn-primary" style={{ padding: "10px 20px" }} onClick={() => setRoomModal("add")}>
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

        {/* ══ HOTEL INFO TAB ══ */}
        {tab === "hotel" && selectedHotel && (
          <div className="card" style={{ padding: "28px 24px", maxWidth: 600 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700 }}>
                  {selectedHotel.hotelName}
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                  Hotel ID: #{selectedHotel.hotelId}
                </div>
              </div>
              <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => setEditHotel(true)}>
                ✏️ Edit Hotel
              </button>
            </div>

            {[
              ["Hotel Name",  selectedHotel.hotelName],
              ["Location",    selectedHotel.location    || "—"],
              ["Star Rating", selectedHotel.ratings
                ? `${"★".repeat(Math.min(selectedHotel.ratings, 5))} (${selectedHotel.ratings})`
                : "—"],
              ["Description", selectedHotel.description || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 16, padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                <span style={{ color: "var(--muted)", minWidth: 110 }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* No hotels assigned yet */}
        {hotels.length === 0 && !loading && (
          <div className="empty-state card" style={{ padding: "64px 24px", textAlign: "center" }}>
            <div className="empty-icon">🏨</div>
            <div className="empty-h">No hotels assigned to your account yet</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
              Contact an admin to assign a hotel to your account.
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default HotelOwnerDashboard