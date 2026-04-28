import axios from "axios"
import { useState } from "react"
import { adminStyles as s } from "../../styles/admin-styles"

const BASE = "http://localhost:8080"

const STATUS_CFG = {
    CONFIRMED: { badge: "badge-green", label: "Confirmed", icon: "✅" },
    PENDING:   { badge: "badge-amber", label: "Pending",   icon: "⏳" },
    CANCELLED: { badge: "badge-red",   label: "Cancelled", icon: "❌" },
    REFUNDED:  { badge: "badge-blue",  label: "Refunded",  icon: "💰" },
}

const getNights = (ci, co) => {
    if (!ci || !co) return 1
    const d = Math.round((new Date(co) - new Date(ci)) / 86400000)
    return d > 0 ? d : 1
}

const AdminBookingList = ({ bookings, setBookings, onToast, page, setPage, totalPages }) => {
    const [filterStatus, setFilterStatus] = useState("ALL")
    const [refunding,    setRefunding]    = useState(null)

    const token    = localStorage.getItem("token")
    const statuses = ["ALL", ...new Set(bookings.map(b => b.bookingStatus))]
    const displayed = filterStatus === "ALL" ? bookings : bookings.filter(b => b.bookingStatus === filterStatus)

    const handleRefund = async (bookingId) => {
        if (!window.confirm("Issue refund for this booking?")) return
        setRefunding(bookingId)
        try {
            await axios.put(`${BASE}/api/booking/refund/${bookingId}`, {},
                { headers: { Authorization: "Bearer " + token } })
            setBookings(prev => prev.map(b =>
                b.bookingId === bookingId ? { ...b, bookingStatus: "REFUNDED" } : b))
            onToast("Refund issued successfully.")
        } catch (e) {
            onToast(e.response?.data?.message || "Refund failed.")
        } finally { setRefunding(null) }
    }

    return (
        <div>
            <div style={{ ...s.rowBetween, marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#555" }}>
                    <strong>{displayed.length}</strong> booking{displayed.length !== 1 ? "s" : ""}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {statuses.map(st => (
                        <span key={st}
                            style={filterStatus === st ? s.chipActive : { ...s.chip, cursor: "pointer" }}
                            onClick={() => setFilterStatus(st)}>
                            {st === "ALL"
                                ? `All (${bookings.length})`
                                : `${STATUS_CFG[st]?.label || st} (${bookings.filter(b => b.bookingStatus === st).length})`}
                        </span>
                    ))}
                </div>
            </div>

            <div style={s.colList}>
                {displayed.map(b => {
                    const cfg       = STATUS_CFG[b.bookingStatus] || { badge: "badge-gold", label: b.bookingStatus, icon: "📋" }
                    const nights    = getNights(b.checkInDate, b.checkOutDate)
                    const total     = Number(b.totalPrice) || 0
                    const canRefund = b.bookingStatus === "CANCELLED"

                    return (
                        <div key={b.bookingId} style={s.bookingItem}>
                            <div style={s.bookingItemHeader}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontWeight: 700, fontSize: 13 }}>Booking #{b.bookingId}</span>
                                    <span className={`badge ${cfg.badge}`}>{cfg.icon} {cfg.label}</span>
                                    {b.hotelName && <span style={s.chip}>🏨 {b.hotelName}</span>}
                                </div>
                                {b.cancellationDate && <span style={{ fontSize: 11, color: "#888" }}>Cancelled: {b.cancellationDate}</span>}
                            </div>
                            <div style={s.bookingItemBody}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                                        👤 {b.guestName || "—"}
                                        <span style={{ ...s.chip, marginLeft: 8 }}>✉️ {b.email || "—"}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
                                        {b.bedType  && <span>🛏️ {b.bedType} Room</span>}
                                        {b.roomSize && <span style={{ marginLeft: 12 }}>📐 {b.roomSize}</span>}
                                        {b.acType   && <span style={{ marginLeft: 12 }}>❄️ {b.acType}</span>}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#555" }}>
                                        📅 <strong>{b.checkInDate}</strong> → <strong>{b.checkOutDate}</strong> · {nights}N
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 11, color: "#888" }}>Total</div>
                                    <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>
                                        {total > 0 ? `₹${total.toLocaleString("en-IN")}` : "—"}
                                    </div>
                                    {total > 0 && nights > 1 && (
                                        <div style={{ fontSize: 11, color: "#888" }}>
                                            ₹{Math.round(total / nights).toLocaleString("en-IN")}/night
                                        </div>
                                    )}
                                    {canRefund && (
                                        <button style={{ ...s.secondaryBtn, marginTop: 8 }}
                                            disabled={refunding === b.bookingId}
                                            onClick={() => handleRefund(b.bookingId)}>
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
                    <button style={s.secondaryBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span style={{ fontSize: 13, color: "#888" }}>Page {page + 1} of {totalPages}</span>
                    <button style={s.secondaryBtn} disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}
        </div>
    )
}

export default AdminBookingList