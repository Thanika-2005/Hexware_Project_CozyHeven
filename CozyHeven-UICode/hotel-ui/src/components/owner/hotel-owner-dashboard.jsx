import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ownerStyles as s } from "../../styles/owner-styles"
import AdminToast      from "../admin/admin-toast"
import OwnerStatCards  from "./owner-stat-cards"
import OwnerBookingList from "./owner-booking-list"
import OwnerRoomList   from "./owner-room-list"
import OwnerHotelInfo  from "./owner-hotel-info"

const BASE = "http://localhost:8080"

const HotelOwnerDashboard = () => {
    const navigate = useNavigate()
    const token    = localStorage.getItem("token")

    const [tab,          setTab]          = useState("bookings")
    const [hotels,       setHotels]       = useState([])
    const [selectedHotel,setSelectedHotel]= useState(null)
    const [bookings,     setBookings]     = useState([])
    const [rooms,        setRooms]        = useState([])
    const [loading,      setLoading]      = useState(true)
    const [toast,        setToast]        = useState("")

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
            const hotelList = (hotelsRes.data)  ? hotelsRes.data  : []
            const bks       = (bookingsRes.data) ? bookingsRes.data : []
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
            const res = await axios.get(`${BASE}/api/room/${hotelId}/rooms/v1`,
                { headers: { Authorization: "Bearer " + token } })
            setRooms((res.data) ? res.data : [])
        } catch { setRooms([]) }
    }

    const handleHotelSwitch = (hotel) => {
        setSelectedHotel(hotel)
        loadRooms(hotel.hotelId)
    }

    const TABS = [
        ["bookings", "📋 Bookings"],
        ["rooms",    "🛏️ Rooms"],
        ["hotel",    "🏨 Hotel Info"],
    ]

    if (loading) return <div style={s.spinner}>Loading…</div>

    return (
        <div style={s.page}>
            {toast && <AdminToast msg={toast} onDone={() => setToast("")} />}

            <div style={s.header}>
                <div style={s.headerInner}>
                    <div>
                        <div style={s.headerTitle}>🏨 Owner Dashboard</div>
                        <div style={s.headerSub}>Manage your hotels, rooms &amp; bookings</div>
                    </div>
                    <button style={s.homeBtn} onClick={() => navigate("/")}>← Home</button>
                </div>
            </div>

            <div style={s.content}>

                {/* Hotel switcher — shown only if owner has multiple hotels */}
                {hotels.length > 1 && (
                    <div style={s.hotelSwitcher}>
                        {hotels.map(h => (
                            <button key={h.hotelId}
                                style={selectedHotel?.hotelId === h.hotelId ? s.chipActive : s.chip}
                                onClick={() => handleHotelSwitch(h)}>
                                🏨 {h.hotelName}
                            </button>
                        ))}
                    </div>
                )}

                <OwnerStatCards bookings={bookings} rooms={rooms} selectedHotel={selectedHotel} />

                <div style={s.tabsRow}>
                    {TABS.map(([key, label]) => (
                        <button key={key} style={s.tab(tab === key)} onClick={() => setTab(key)}>
                            {label}
                        </button>
                    ))}
                </div>

                {tab === "bookings" && (
                    <OwnerBookingList
                        bookings={bookings}
                        setBookings={setBookings}
                        selectedHotel={selectedHotel}
                        onToast={setToast}
                    />
                )}

                {tab === "rooms" && (
                    <OwnerRoomList
                        rooms={rooms}
                        setRooms={setRooms}
                        selectedHotel={selectedHotel}
                        onToast={setToast}
                    />
                )}

                {tab === "hotel" && (
                    <OwnerHotelInfo
                        selectedHotel={selectedHotel}
                        onToast={setToast}
                        onReload={loadDashboard}
                    />
                )}

                {hotels.length === 0 && !loading && (
                    <div style={s.emptyState}>
                        <div style={s.emptyIcon}>🏨</div>
                        <div style={s.emptyText}>No hotels assigned to your account yet</div>
                        <div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
                            Contact an admin to assign a hotel to your account.
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default HotelOwnerDashboard