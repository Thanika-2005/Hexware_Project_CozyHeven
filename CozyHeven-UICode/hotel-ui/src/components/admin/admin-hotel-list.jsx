import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminStyles as s } from "../../styles/admin-styles"
import AddHotelModal from "./add-hotel-modal"

const BASE = "http://localhost:8080"

const AdminHotelList = ({ hotels, setHotels, bookings, onToast, onManageRooms, onReloadHotels }) => {
    const [hotelSearch,   setHotelSearch]  = useState("")
    const [addHotelOpen,  setAddHotelOpen] = useState(false)
    const [deletingHotel, setDeletingHotel]= useState(null)

    const navigate = useNavigate()
    const token    = localStorage.getItem("token")

    const displayed = hotels.filter(h =>
        h.hotelName?.toLowerCase().includes(hotelSearch.toLowerCase()) ||
        h.location?.toLowerCase().includes(hotelSearch.toLowerCase())
    )

    const handleDelete = async (hotelId) => {
        if (!window.confirm("Delete this hotel and all its data?")) return
        setDeletingHotel(hotelId)
        try {
            await axios.delete(`${BASE}/api/hotel/delete/${hotelId}`,
                { headers: { Authorization: "Bearer " + token } })
            setHotels(prev => prev.filter(h => h.hotelId !== hotelId))
            onToast("Hotel deleted.")
        } catch (e) {
            onToast(e.response?.data?.message || "Could not delete hotel.")
        } finally { setDeletingHotel(null) }
    }

    return (
        <div>
            {addHotelOpen && (
                <AddHotelModal
                    onClose={() => setAddHotelOpen(false)}
                    onSaved={msg => { onToast(msg); setAddHotelOpen(false); onReloadHotels?.() }}
                />
            )}

            <div style={{ ...s.rowBetween, marginBottom: 16 }}>
                <input style={{ ...s.input, maxWidth: 300 }}
                    placeholder="🔍 Search hotels or cities…"
                    value={hotelSearch}
                    onChange={e => setHotelSearch(e.target.value)} />
                <button style={s.primaryBtn} onClick={() => setAddHotelOpen(true)}>+ Add Hotel</button>
            </div>

            <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
                <strong>{displayed.length}</strong> hotel{displayed.length !== 1 ? "s" : ""}
            </div>

            {displayed.length === 0 && (
                <div style={s.emptyState}>
                    <div style={s.emptyIcon}>🏨</div>
                    <div style={s.emptyText}>No hotels found</div>
                </div>
            )}

            <div style={s.colList}>
                {displayed.map(h => {
                    const hotelBkCount = bookings.filter(b => b.hotelId === h.hotelId).length
                    const hotelRevenue = bookings
                        .filter(b => b.hotelId === h.hotelId && (b.bookingStatus === "CONFIRMED" || b.bookingStatus === "REFUNDED"))
                        .reduce((sum, b) => {
                            const amt = Number(b.totalPrice) || 0
                            return b.bookingStatus === "REFUNDED" ? sum - amt : sum + amt
                        }, 0)

                    return (
                        <div key={h.hotelId} style={s.card}>
                            <div style={s.rowBetween}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                                        🏨 {h.hotelName}
                                        <span style={{ ...s.chip, marginLeft: 10, background: "#fef9c3", color: "#a16207" }}>
                                            {"★".repeat(Math.min(h.ratings || 0, 5))} {h.ratings}
                                        </span>
                                    </div>
                                    <div style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>📍 {h.location}</div>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        <span style={s.chip}>📋 {hotelBkCount} booking{hotelBkCount !== 1 ? "s" : ""}</span>
                                        <span style={s.chip}>💰 ₹{hotelRevenue.toLocaleString("en-IN")}</span>
                                        {h.amenities?.slice(0, 3).map((a, i) => <span key={i} style={s.chip}>{a.name}</span>)}
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <button style={s.secondaryBtn} onClick={() => onManageRooms(h)}>🛏️ Rooms</button>
                                    <button style={s.secondaryBtn} onClick={() => navigate(`/hotels/${h.hotelId}`)}>👁️ View</button>
                                    <button style={s.dangerBtn}
                                        disabled={deletingHotel === h.hotelId}
                                        onClick={() => handleDelete(h.hotelId)}>
                                        {deletingHotel === h.hotelId ? "Deleting…" : "🗑️ Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AdminHotelList