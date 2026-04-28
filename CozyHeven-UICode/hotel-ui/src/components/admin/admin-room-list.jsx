import axios from "axios"
import { useState } from "react"
import { adminStyles as s } from "../../styles/admin-styles"
import RoomModal from "./room-modal"

const BASE = "http://localhost:8080"

const AC_LABELS = { CENTRAL: "Central AC", SPLIT: "Split AC", NONE: "Non-AC" }

const ROOM_STATUS = {
    AVAILABLE:   { style: { background: "#dcfce7", color: "#15803d" }, label: "Available"   },
    OCCUPIED:    { style: { background: "#fee2e2", color: "#b91c1c" }, label: "Occupied"    },
    MAINTENANCE: { style: { background: "#fef9c3", color: "#a16207" }, label: "Maintenance" },
}

const AdminRoomList = ({ rooms, setRooms, hotels, selectedHotel, setSelectedHotel, onToast }) => {
    const [roomModal,    setRoomModal]    = useState(null)
    const [deletingRoom, setDeletingRoom] = useState(null)

    const token = localStorage.getItem("token")

    const loadRooms = async (hotelId) => {
        try {
            const res = await axios.get(`${BASE}/api/room/${hotelId}/rooms/v1`,
                { headers: { Authorization: "Bearer " + token } })
            setRooms((res.data) ? res.data : [])
        } catch { setRooms([]) }
    }

    const handleHotelSwitch = (e) => {
        const hotel = hotels.find(h => h.hotelId === Number(e.target.value))
        if (hotel) { setSelectedHotel(hotel); loadRooms(hotel.hotelId) }
    }

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm("Delete this room permanently?")) return
        setDeletingRoom(roomId)
        try {
            await axios.delete(`${BASE}/api/room/delete/${roomId}`,
                { headers: { Authorization: "Bearer " + token } })
            setRooms(prev => prev.filter(r => r.roomId !== roomId))
            onToast("Room deleted.")
        } catch (e) {
            onToast(e.response?.data?.message || "Could not delete room.")
        } finally { setDeletingRoom(null) }
    }

    if (!selectedHotel) return (
        <div style={s.emptyState}>
            <div style={s.emptyIcon}>🛏️</div>
            <div style={s.emptyText}>No hotel selected. Go to Hotels tab and click 🛏️ Rooms.</div>
        </div>
    )

    return (
        <div>
            {roomModal && (
                <RoomModal
                    hotelId={selectedHotel.hotelId}
                    room={roomModal === "add" ? null : roomModal}
                    onClose={() => setRoomModal(null)}
                    onSaved={msg => { onToast(msg); loadRooms(selectedHotel.hotelId) }}
                />
            )}

            <div style={{ ...s.rowBetween, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "#888" }}>
                    <strong>{rooms.length}</strong> room{rooms.length !== 1 ? "s" : ""}
                    <span> · {selectedHotel.hotelName}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <select style={{ ...s.input, fontSize: 13, padding: "8px 12px" }}
                        value={selectedHotel.hotelId} onChange={handleHotelSwitch}>
                        {hotels.map(h => <option key={h.hotelId} value={h.hotelId}>{h.hotelName}</option>)}
                    </select>
                    <button style={s.primaryBtn} onClick={() => setRoomModal("add")}>+ Add Room</button>
                </div>
            </div>

            {rooms.length === 0 && (
                <div style={s.emptyState}>
                    <div style={s.emptyIcon}>🛏️</div>
                    <div style={s.emptyText}>No rooms yet for {selectedHotel.hotelName}</div>
                    <button style={{ ...s.primaryBtn, marginTop: 16 }} onClick={() => setRoomModal("add")}>Add First Room</button>
                </div>
            )}

            <div style={s.colList}>
                {rooms.map(r => {
                    const sc = ROOM_STATUS[r.status] || { style: {}, label: r.status }
                    return (
                        <div key={r.roomId} style={s.card}>
                            <div style={s.rowBetween}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                                        🛏️ {r.bedType} Room
                                        <span style={{ ...s.chip, ...sc.style, marginLeft: 10 }}>● {sc.label}</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        <span style={s.chip}>📐 {r.roomSize}</span>
                                        <span style={s.chip}>❄️ {AC_LABELS[r.acType] || r.acType}</span>
                                        <span style={s.chip}>👥 Max {r.maxPeople}</span>
                                        <span style={s.chip}>🛏️ {r.availability} unit{r.availability !== 1 ? "s" : ""} left</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 17, fontWeight: 700 }}>₹{Number(r.basePrice).toLocaleString("en-IN")}</div>
                                        <div style={{ fontSize: 11, color: "#888" }}>per night</div>
                                    </div>
                                    <button style={s.secondaryBtn} onClick={() => setRoomModal(r)}>✏️ Edit</button>
                                    <button style={s.dangerBtn}
                                        disabled={deletingRoom === r.roomId}
                                        onClick={() => handleDeleteRoom(r.roomId)}>
                                        {deletingRoom === r.roomId ? "…" : "🗑️"}
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

export default AdminRoomList