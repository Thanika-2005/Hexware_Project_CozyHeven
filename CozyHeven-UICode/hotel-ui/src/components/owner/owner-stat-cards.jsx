import { ownerStyles as s } from "../../styles/owner-styles"

const COLORS = {
    ink:   "#1a1a2e",
    green: "#15803d",
    red:   "#b91c1c",
    gold:  "#c9a84c",
    blue:  "#1d4ed8",
}

const OwnerStatCards = ({ bookings, rooms, selectedHotel }) => {
    const hotelBookings = bookings.filter(b => b.hotelId === selectedHotel?.hotelId)
    const confirmed     = hotelBookings.filter(b => b.bookingStatus === "CONFIRMED").length
    const cancelled     = hotelBookings.filter(b => b.bookingStatus === "CANCELLED").length
    const revenue       = hotelBookings
        .filter(b => b.bookingStatus === "CONFIRMED" || b.bookingStatus === "REFUNDED")
        .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0)
    const availRooms    = rooms.filter(r => r.status === "AVAILABLE").length

    const stats = [
        { icon: "📋", label: "Total Bookings",  value: hotelBookings.length,                  color: COLORS.ink   },
        { icon: "✅", label: "Confirmed",        value: confirmed,                              color: COLORS.green },
        { icon: "❌", label: "Cancelled",        value: cancelled,                              color: COLORS.red   },
        { icon: "💰", label: "Revenue",          value: `₹${revenue.toLocaleString("en-IN")}`, color: COLORS.gold  },
        { icon: "🛏️", label: "Available Rooms",  value: `${availRooms} / ${rooms.length}`,     color: COLORS.blue  },
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

export default OwnerStatCards