import { adminStyles as s } from "../../styles/admin-styles"

const COLORS = {
    ink:   "#1a1a2e",
    green: "#15803d",
    red:   "#b91c1c",
    blue:  "#1d4ed8",
    gold:  "#c9a84c",
}

const AdminStatCards = ({ hotels, bookings }) => {
    const confirmed    = bookings.filter(b => b.bookingStatus === "CONFIRMED").length
    const cancelled    = bookings.filter(b => b.bookingStatus === "CANCELLED").length
    const refunded     = bookings.filter(b => b.bookingStatus === "REFUNDED").length
    const totalRevenue = bookings
        .filter(b => b.bookingStatus === "CONFIRMED" || b.bookingStatus === "REFUNDED")
        .reduce((sum, b) => {
            const amt = Number(b.totalPrice) || 0
            return b.bookingStatus === "REFUNDED" ? sum - amt : sum + amt
        }, 0)

    const stats = [
        { icon: "🏨", label: "Total Hotels",  value: hotels.length,                              color: COLORS.ink   },
        { icon: "📋", label: "Total Bookings", value: bookings.length,                            color: COLORS.ink   },
        { icon: "✅", label: "Confirmed",      value: confirmed,                                  color: COLORS.green },
        { icon: "❌", label: "Cancelled",      value: cancelled,                                  color: COLORS.red   },
        { icon: "💰", label: "Refunded",       value: refunded,                                   color: COLORS.blue  },
        { icon: "💵", label: "Net Revenue",    value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: COLORS.gold  },
    ]

    return (
        <div style={s.statsGrid}>
            {stats.map(stat => (
                <div key={stat.label} style={s.statCard}>
                    <div style={s.statIcon}>{stat.icon}</div>
                    <div style={s.statValue(stat.color)}>{stat.value}</div>
                    <div style={s.statLabel}>{stat.label}</div>
                </div>
            ))}
        </div>
    )
}

export default AdminStatCards