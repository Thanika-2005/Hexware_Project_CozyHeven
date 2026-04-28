import axios from "axios"
import { useState } from "react"
import { ownerStyles as s } from "../../styles/owner-styles"

const BASE = "http://localhost:8080"

const STATUS_CFG = {
    CONFIRMED: { label: "Confirmed", icon: "✅", badgeStyle: { background: "#dcfce7", color: "#15803d" } },
    PENDING:   { label: "Pending",   icon: "⏳", badgeStyle: { background: "#fef9c3", color: "#a16207" } },
    CANCELLED: { label: "Cancelled", icon: "❌", badgeStyle: { background: "#fee2e2", color: "#b91c1c" } },
    REFUNDED:  { label: "Refunded",  icon: "💰", badgeStyle: { background: "#dbeafe", color: "#1d4ed8" } },
}

const getNights = (ci, co) => {
    if (!ci || !co) return 1
    const d = Math.round((new Date(co) - new Date(ci)) / 86400000)
    return d > 0 ? d : 1
}

const OwnerBookingList = ({ bookings, setBookings, selectedHotel, onToast }) => {
    const [filterStatus, setFilterStatus] = useState("ALL")
    const [refunding,    setRefunding]    = useState(null)

    const token         = localStorage.getItem("token")
    const hotelBookings = bookings.filter(b => b.hotelId === selectedHotel?.hotelId)
    const statuses      = ["ALL", ...new Set(hotelBookings.map(b => b.bookingStatus))]
    const displayed     = filterStatus === "ALL"
        ? hotelBookings
        : hotelBookings.filter(b => b.bookingStatus === filterStatus)

    const handleRefund = async (bookingId) => {
        if (!window.confirm("Issue refund for this booking?")) return
        setRefunding(bookingId)
        try {
            await axios.put(`${BASE}/api/booking/refund/${bookingId}`, {},
                { headers: { Authorization: "Bearer " + token } })
            setBookings(prev => prev.map(b =>
                b.bookingId === bookingId ? { ...b, bookingStatus: "REFUNDED" } : b))
            onToast("Refund issued.")
        } catch (e) {
            onToast(e.response?.data?.message || "Refund failed.")
        } finally { setRefunding(null) }
    }

    return (
        <div>
            <div style={{ ...s.rowBetween, marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#555" }}>
                    <strong>{displayed.length}</strong> booking{displayed.length !== 1 ? "s" : ""}
                    {selectedHotel ? ` · ${selectedHotel.hotelName}` : ""}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {statuses.map(st => (
                        <button key={st}
                            style={filterStatus === st ? s.chipActive : s.chip}
                            onClick={() => setFilterStatus(st)}>
                            {st === "ALL"
                                ? `All (${hotelBookings.length})`
                                : `${STATUS_CFG[st]?.label || st} (${hotelBookings.filter(b => b.bookingStatus === st).length})`}
                        </button>
                    ))}
                </div>
            </div>

            {displayed.length === 0 && (
                <div style={s.emptyState}>
                    <div style={s.emptyIcon}>📋</div>
                    <div style={s.emptyText}>No bookings found</div>
                </div>
            )}

            <div style={s.colList}>
                {displayed.map(b => {
                    const cfg       = STATUS_CFG[b.bookingStatus] || { label: b.bookingStatus, icon: "📋", badgeStyle: {} }
                    const nights    = getNights(b.checkInDate, b.checkOutDate)
                    const total     = Number(b.totalPrice) || 0
                    const canRefund = b.bookingStatus === "CANCELLED"

                    return (
                        <div key={b.bookingId} style={s.bookingItem}>
                            <div style={s.bookingItemHeader}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontWeight: 700, fontSize: 13 }}>Booking #{b.bookingId}</span>
                                    <span style={{ ...s.infoChip, ...cfg.badgeStyle }}>{cfg.icon} {cfg.label}</span>
                                </div>
                                {b.cancellationDate && (
                                    <span style={{ fontSize: 11, color: "#888" }}>Cancelled: {b.cancellationDate}</span>
                                )}
                            </div>

                            <div style={s.bookingItemBody}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                                        👤 {b.guestName || "—"}
                                        <span style={{ ...s.infoChip, marginLeft: 8 }}>✉️ {b.email || "—"}</span>
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
    )
}

export default OwnerBookingList