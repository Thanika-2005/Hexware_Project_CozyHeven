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

const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1
  const d = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)
  return d > 0 ? d : 1
}


const Toast = ({ msg, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      background: "#2d3a2e", color: "#fff", padding: "13px 28px",
      borderRadius: 40, fontSize: 14, fontWeight: 500,
      boxShadow: "0 6px 32px rgba(0,0,0,.22)", zIndex: 9999,
      animation: "fadeInUp .25s ease",
    }}>{msg}</div>
  )
}

// Booking detail modal
const BookingDetailModal = ({ booking, onClose }) => {
  const cfg    = STATUS_CFG[booking.bookingStatus] || { badge: "badge-gold", label: booking.bookingStatus, icon: "📋" }
  const total  = Number(booking.totalPrice) || 0
  const nights = getNights(booking.checkInDate, booking.checkOutDate)

  const handleDownload = () => {
    const lines = [
      "========================================",
      "         COZYHEVEN BOOKING RECEIPT",
      "========================================",
      `Booking ID     : #${booking.bookingId}`,
      `Status         : ${cfg.label}`,
      `Hotel          : ${booking.hotelName || "—"}`,
      `Room           : ${booking.bedType ? booking.bedType + " Room" : "—"}`,
      `Room Size      : ${booking.roomSize || "—"}`,
      `AC Type        : ${booking.acType || "—"}`,
      `Check-in       : ${booking.checkInDate}`,
      `Check-out      : ${booking.checkOutDate}`,
      `Duration       : ${nights} night${nights !== 1 ? "s" : ""}`,
      `Guest Name     : ${booking.guestName || "—"}`,
      `Email          : ${booking.email || "—"}`,
      `Per night      : ${total > 0 && nights > 0 ? `₹${Math.round(total / nights).toLocaleString("en-IN")}` : "—"}`,
      "----------------------------------------",
      `Total Paid     : ₹${total.toLocaleString("en-IN")}`,
      "========================================",
      "Thank you for choosing CozyHeven!",
      `Downloaded: ${new Date().toLocaleString("en-IN")}`,
    ].join("\n")

    const blob = new Blob([lines], { type: "text/plain" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = `cozyheven-booking-${booking.bookingId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo" style={{ marginBottom: 4 }}>Booking <span>Details</span></div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--gold-bg)", borderRadius: 10, padding: "10px 16px", marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>{cfg.icon}</span>
          <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
          <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>#{booking.bookingId}</span>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {[
            ["Hotel",     booking.hotelName || "—"],
            ["Room",      booking.bedType ? booking.bedType + " Room" : "—"],
            ["Room Size", booking.roomSize  || "—"],
            ["AC Type",   booking.acType    || "—"],
            ["Check-in",  booking.checkInDate],
            ["Check-out", booking.checkOutDate],
            ["Duration",  `${nights} night${nights !== 1 ? "s" : ""}`],
            ["Guest",     booking.guestName || "—"],
            ["Email",     booking.email     || "—"],
            ["Per night", total > 0 && nights > 0 ? `₹${Math.round(total / nights).toLocaleString("en-IN")}` : "—"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--muted)" }}>{k}</span>
              <span style={{ fontWeight: 500, color: "var(--ink)" }}>{v}</span>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, padding: "12px 0 0" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Total Paid</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "var(--gold)", fontFamily: "'Playfair Display',serif" }}>
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button className="btn-primary"   style={{ flex: 1, padding: "12px" }} onClick={handleDownload}>⬇️ Download Receipt</button>
          <button className="btn-secondary" style={{ padding: "12px 20px" }}     onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

// Review modal
const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating,  setRating]  = useState(5)
  const [title,   setTitle]   = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [errMsg,  setErrMsg]  = useState("")

  const handleSubmit = async () => {
    if (!title.trim())   { setErrMsg("Please add a title.");       return }
    if (!comment.trim()) { setErrMsg("Please write a comment.");   return }
    setLoading(true)
    setErrMsg("")
    try {
      const token = localStorage.getItem("token")
      await axios.post(`${BASE}/api/review/add`, {
        hotelId:   booking.hotelId,
        bookingId: booking.bookingId,
        rating,
        title,
        comment,
      }, { headers: { Authorization: "Bearer " + token } })
      onSuccess()
      onClose()
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Failed to submit review. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">Write a <span>Review</span></div>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
          Booking #{booking.bookingId} · {booking.checkInDate} – {booking.checkOutDate}
        </p>

        {errMsg && <div className="alert alert-danger">{errMsg}</div>}

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="lbl">Your Rating</label>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => setRating(s)}
                style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer", color: s <= rating ? "var(--gold)" : "var(--border2)", transition: "color .15s" }}
              >★</button>
            ))}
            <span style={{ fontSize: 13, color: "var(--muted)", alignSelf: "center", marginLeft: 8 }}>{rating} / 5</span>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="lbl">Title</label>
          <input className="input" placeholder="Summarise your stay…" value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="lbl">Your Review</label>
          <textarea
            className="textarea"
            placeholder="Tell others about your experience — what did you love? What could be better?"
            value={comment}
            onChange={e => setComment(e.target.value)}
            style={{ minHeight: 100 }}
          />
        </div>

        <button className="btn-primary" style={{ width: "100%", padding: "13px" }} onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting…" : "Submit Review"}
        </button>
      </div>
    </div>
  )
}

// Main page
const MyBookingsPage = () => {
  const navigate = useNavigate()

  const [bookings,      setBookings]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [cancelling,    setCancelling]    = useState(null)
  const [filterStatus,  setFilterStatus]  = useState("ALL")
  const [reviewTarget,  setReviewTarget]  = useState(null)
  const [detailTarget,  setDetailTarget]  = useState(null)
  const [toast,         setToast]         = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/"); return }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${BASE}/api/booking/my-bookings`, {
          headers: { Authorization: "Bearer " + token },
        })
        setBookings((res.data) ? res.data : [])
      } catch {
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return
    setCancelling(bookingId)
    try {
      const token = localStorage.getItem("token")
      await axios.put(`${BASE}/api/booking/cancel/${bookingId}`, {}, {
        headers: { Authorization: "Bearer " + token },
      })
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, bookingStatus: "CANCELLED" } : b))
      setToast("Booking cancelled.")
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel booking.")
    } finally {
      setCancelling(null)
    }
  }

  const statuses  = ["ALL", ...new Set(bookings.map(b => b.bookingStatus))]
  const displayed = filterStatus === "ALL" ? bookings : bookings.filter(b => b.bookingStatus === filterStatus)

  return (
    <div className="page-fade">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      {reviewTarget && (
        <ReviewModal
          booking={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSuccess={() => setToast("Review submitted! Thank you.")}
        />
      )}
      {detailTarget && (
        <BookingDetailModal
          booking={detailTarget}
          onClose={() => setDetailTarget(null)}
        />
      )}

      <div className="mybookings-wrap">
        <div className="mybookings-head">
          <div>
            <span className="section-tag">Reservation History</span>
            <h1 className="section-h" style={{ fontSize: 28 }}>My Bookings</h1>
          </div>
          <button className="btn-secondary" style={{ padding: "9px 18px" }} onClick={() => navigate("/hotels")}>
            + New Booking
          </button>
        </div>

        {/* Filter tabs */}
        {bookings.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
            {statuses.map(s => (
              <span
                key={s}
                className={filterStatus === s ? "chip-active" : "chip chip-clickable"}
                onClick={() => setFilterStatus(s)}
              >
                {s === "ALL"
                  ? `All (${bookings.length})`
                  : `${STATUS_CFG[s]?.label || s} (${bookings.filter(b => b.bookingStatus === s).length})`}
              </span>
            ))}
          </div>
        )}

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

        {!loading && bookings.length === 0 && (
          <div className="empty-state card" style={{ padding: "60px 24px" }}>
            <div className="empty-icon">🛎️</div>
            <div className="empty-h">No bookings yet</div>
            <p className="empty-p">You haven't made any bookings. Find your perfect stay and book now!</p>
            <button className="btn-primary" style={{ padding: "12px 28px" }} onClick={() => navigate("/hotels")}>
              Explore Hotels
            </button>
          </div>
        )}

        <div className="bookings-list">
          {displayed.map(booking => {
            const cfg      = STATUS_CFG[booking.bookingStatus] || { badge: "badge-gold", label: booking.bookingStatus, icon: "📋" }
            const canCancel = booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "PENDING"
            const total    = Number(booking.totalPrice) || 0
            const nights   = getNights(booking.checkInDate, booking.checkOutDate)

            return (
              <div
                key={booking.bookingId}
                className="booking-item"
                style={{ cursor: "pointer" }}
                onClick={() => setDetailTarget(booking)}
              >
                <div className="booking-item-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="booking-item-id">Booking #{booking.bookingId}</span>
                    <span className={`badge ${cfg.badge}`}>{cfg.icon} {cfg.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {booking.cancellationDate && (
                      <span className="tkey">Cancelled: {booking.cancellationDate}</span>
                    )}
                    <span style={{ fontSize: 11, color: "var(--gold)", fontWeight: 600 }}>View Details →</span>
                  </div>
                </div>

                <div className="booking-item-body">
                  <div className="booking-item-info">
                    <div className="booking-item-hotel">
                      🏨 {booking.hotelName || (booking.bedType ? `${booking.bedType} Room` : "Hotel Room")}
                    </div>
                    <div className="booking-item-room">
                      {booking.roomSize && <span>📐 {booking.roomSize}</span>}
                      {booking.acType   && <span style={{ marginLeft: 12 }}>❄️ {booking.acType}</span>}
                    </div>
                    <div className="booking-item-dates">
                      📅 <strong>{booking.checkInDate}</strong> → <strong>{booking.checkOutDate}</strong>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {booking.guestName && <span className="chip">👤 {booking.guestName}</span>}
                      {booking.email     && <span className="chip">✉️ {booking.email}</span>}
                    </div>
                  </div>

                  <div className="booking-item-right" onClick={e => e.stopPropagation()}>
                    <div>
                      <div className="tkey" style={{ marginBottom: 2 }}>Total ({nights} night{nights !== 1 ? "s" : ""})</div>
                      <div className="price-med">
                        {total > 0 ? `₹${total.toLocaleString("en-IN")}` : "—"}
                      </div>
                      {total > 0 && nights > 1 && (
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                          ₹{Math.round(total / nights).toLocaleString("en-IN")} / night
                        </div>
                      )}
                    </div>

                    {(booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "COMPLETED") && (
                      <button
                        className="btn-secondary"
                        style={{ padding: "8px 14px", fontSize: 12 }}
                        onClick={e => { e.stopPropagation(); setReviewTarget(booking) }}
                      >
                        ✍️ Write Review
                      </button>
                    )}

                    {canCancel && (
                      <button
                        className="btn-danger"
                        disabled={cancelling === booking.bookingId}
                        onClick={e => { e.stopPropagation(); handleCancel(booking.bookingId) }}
                      >
                        {cancelling === booking.bookingId ? "Cancelling…" : "Cancel"}
                      </button>
                    )}

                    <button
                      className="btn-ghost"
                      style={{ padding: "7px 12px", fontSize: 11 }}
                      onClick={e => { e.stopPropagation(); setDetailTarget(booking) }}
                    >
                      ⬇️ Receipt
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  )
}

export default MyBookingsPage