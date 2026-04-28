import { adminStyles as s } from "../../styles/admin-styles"

const STATUS_CFG = {
    CONFIRMED: { label: "Confirmed", icon: "✅" },
    PENDING:   { label: "Pending",   icon: "⏳" },
    CANCELLED: { label: "Cancelled", icon: "❌" },
    REFUNDED:  { label: "Refunded",  icon: "💰" },
}

const AdminOverview = ({ bookings }) => {
    const hotelCount = {}
    bookings.forEach(b => {
        if (b.hotelName) hotelCount[b.hotelName] = (hotelCount[b.hotelName] || 0) + 1
    })
    const topHotels = Object.entries(hotelCount).sort(([, a], [, b]) => b - a).slice(0, 5)

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            <div style={s.card}>
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
                            <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4 }}>
                                <div style={{ height: 6, borderRadius: 4, background: "#c9a84c", width: `${pct}%`, transition: "width .4s" }} />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div style={s.card}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Hotels by Bookings</div>
                {topHotels.map(([name, count]) => (
                    <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e5e5e5", fontSize: 13 }}>
                        <span>🏨 {name}</span>
                        <span style={{ ...s.chip, background: "#fef9c3", color: "#a16207" }}>{count} booking{count !== 1 ? "s" : ""}</span>
                    </div>
                ))}
                {topHotels.length === 0 && <div style={{ color: "#888", fontSize: 13 }}>No booking data yet.</div>}
            </div>

        </div>
    )
}

export default AdminOverview