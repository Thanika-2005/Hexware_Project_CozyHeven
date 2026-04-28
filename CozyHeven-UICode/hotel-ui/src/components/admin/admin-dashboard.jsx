import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminStyles as s } from "../../styles/admin-styles"
import AdminToast      from "./admin-toast"
import AdminStatCards  from "./admin-stat-cards"
import AdminOverview   from "./admin-overview"
import AdminBookingList from "./admin-booking-list"
import AdminHotelList  from "./admin-hotel-list"
import AdminRoomList   from "./admin-room-list"

const BASE = "http://localhost:8080"

const AdminDashboard = () => {
    const navigate = useNavigate()
    const token    = localStorage.getItem("token")

    const [tab,          setTab]         = useState("overview")
    const [bookings,     setBookings]    = useState([])
    const [hotels,       setHotels]      = useState([])
    const [rooms,        setRooms]       = useState([])
    const [selectedHotel,setSelectedHotel]= useState(null)
    const [loading,      setLoading]     = useState(true)
    const [toast,        setToast]       = useState("")
    const [page,         setPage]        = useState(0)
    const [totalPages,   setTotalPages]  = useState(1)

    useEffect(() => {
        if (!token) { navigate("/login"); return }
        loadAll()
    }, [])

    useEffect(() => { loadBookings() }, [page])

    const loadAll = async () => {
        setLoading(true)
        await Promise.allSettled([loadBookings(), loadHotels()])
        setLoading(false)
    }

    const loadBookings = async () => {
        try {
            const res = await axios.get(`${BASE}/api/booking/get-allBooking?page=${page}&size=10`,
                { headers: { Authorization: "Bearer " + token } })
            setBookings((res.data.data) ? res.data.data : [])
            setTotalPages(res.data.totalPages || 1)
        } catch { setBookings([]) }
    }

    const loadHotels = async () => {
        try {
            const res = await axios.get(`${BASE}/api/hotel/get-allhotel?page=0&size=100`,
                { headers: { Authorization: "Bearer " + token } })
            setHotels((res.data.data) ? res.data.data : [])
        } catch { setHotels([]) }
    }

    const loadRooms = async (hotelId) => {
        try {
            const res = await axios.get(`${BASE}/api/room/${hotelId}/rooms/v1`,
                { headers: { Authorization: "Bearer " + token } })
            setRooms((res.data) ? res.data : [])
        } catch { setRooms([]) }
    }

    const handleManageRooms = (hotel) => {
        setSelectedHotel(hotel)
        loadRooms(hotel.hotelId)
        setTab("rooms")
    }

    const TABS = [
        ["overview", "📊 Overview"],
        ["bookings", "📋 All Bookings"],
        ["hotels",   "🏨 Hotels"],
        ["rooms",    "🛏️ Rooms"],
    ]

    if (loading) return <div style={s.spinner}>Loading…</div>

    return (
        <div style={s.page}>
            {toast && <AdminToast msg={toast} onDone={() => setToast("")} />}

            <div style={s.header}>
                <div style={s.headerInner}>
                    <div>
                        <div style={s.headerTitle}>⚙️ Admin Dashboard</div>
                        <div style={s.headerSub}>Full platform management</div>
                    </div>
                    <button style={s.homeBtn} onClick={() => navigate("/")}>← Home</button>
                </div>
            </div>

            <div style={s.content}>

                <AdminStatCards hotels={hotels} bookings={bookings} />

                <div style={s.tabsRow}>
                    {TABS.map(([key, label]) => (
                        <button key={key} style={s.tab(tab === key)} onClick={() => setTab(key)}>
                            {label}
                        </button>
                    ))}
                </div>

                {tab === "overview" && <AdminOverview bookings={bookings} />}

                {tab === "bookings" && (
                    <AdminBookingList
                        bookings={bookings}
                        setBookings={setBookings}
                        onToast={setToast}
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                    />
                )}

                {tab === "hotels" && (
                    <AdminHotelList
                        hotels={hotels}
                        setHotels={setHotels}
                        bookings={bookings}
                        onToast={setToast}
                        onManageRooms={handleManageRooms}
                        onReloadHotels={loadHotels}
                    />
                )}

                {tab === "rooms" && (
                    <AdminRoomList
                        rooms={rooms}
                        setRooms={setRooms}
                        hotels={hotels}
                        selectedHotel={selectedHotel}
                        setSelectedHotel={setSelectedHotel}
                        onToast={setToast}
                    />
                )}

            </div>
        </div>
    )
}

export default AdminDashboard