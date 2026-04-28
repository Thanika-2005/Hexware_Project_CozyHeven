import { useEffect, useState, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"
import "../styles/pages.css"
import "../styles/components.css"

const BASE = "http://localhost:8080"

const GRADIENTS = [
  "linear-gradient(135deg,#DDD0B0,#C4B090)",
  "linear-gradient(135deg,#B0C8D0,#8AAAB8)",
  "linear-gradient(135deg,#E8D8B8,#D4BC90)",
  "linear-gradient(135deg,#D0C0E0,#B8A0C8)",
  "linear-gradient(135deg,#B8D0C0,#90B898)",
  "linear-gradient(135deg,#E0C8A0,#C8A878)",
]
const EMOJIS = ["🏨", "🏩", "🏰", "🏯", "🌇", "🌃"]

const AMENITY_LIST = ["Pool", "Spa", "Gym", "Restaurant", "Free WiFi", "Parking", "Bar", "Airport Shuttle", "Room Service", "Beach Access"]

const CITIES = [
  { name: "Chennai",   state: "Tamil Nadu" },
  { name: "Bangalore", state: "Karnataka" },
  { name: "Goa",       state: "Goa" },
  { name: "Ooty",      state: "Tamil Nadu" },
  { name: "Mumbai",    state: "Maharashtra" },
  { name: "Jaipur",    state: "Rajasthan" },
  { name: "Munnar",    state: "Kerala" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Pune",      state: "Maharashtra" },
  { name: "Kochi",     state: "Kerala" },
]

const GuestDropdown = ({ rooms, setRooms, adults, setAdults, children, setChildren, childAges, setChildAges, onClose }) => {
  const changeChildAge = (idx, val) => {
    const updated = [...childAges]
    updated[idx] = val
    setChildAges(updated)
  }
  const addChild = () => { setChildren(c => c + 1); setChildAges(prev => [...prev, ""]) }
  const removeChild = () => {
    if (children <= 0) return
    setChildren(c => c - 1)
    setChildAges(prev => prev.slice(0, -1))
  }

  return (
    <div className="guest-dropdown-panel">
      <div className="guest-dropdown-row">
        <div><div className="guest-dropdown-label">Room</div></div>
        <div className="guest-counter-wrap">
          <button className="guest-counter-btn" disabled={rooms <= 1} onClick={() => setRooms(r => Math.max(1, r - 1))}>−</button>
          <span className="guest-counter-val">{rooms}</span>
          <button className="guest-counter-btn" onClick={() => setRooms(r => r + 1)}>+</button>
        </div>
      </div>
      <div className="guest-dropdown-row">
        <div>
          <div className="guest-dropdown-label">Adults</div>
          <div className="guest-dropdown-sub">Ages 18 or above</div>
        </div>
        <div className="guest-counter-wrap">
          <button className="guest-counter-btn" disabled={adults <= 1} onClick={() => setAdults(a => Math.max(1, a - 1))}>−</button>
          <span className="guest-counter-val">{adults}</span>
          <button className="guest-counter-btn" onClick={() => setAdults(a => a + 1)}>+</button>
        </div>
      </div>
      <div className="guest-dropdown-row">
        <div>
          <div className="guest-dropdown-label">Children</div>
          <div className="guest-dropdown-sub">Ages 0–17</div>
        </div>
        <div className="guest-counter-wrap">
          <button className="guest-counter-btn" disabled={children <= 0} onClick={removeChild}>−</button>
          <span className="guest-counter-val">{children}</span>
          <button className="guest-counter-btn" onClick={addChild}>+</button>
        </div>
      </div>
      {children > 0 && (
        <div className="child-ages-section">
          <p className="child-ages-note">For accurate room pricing, enter your child's correct age.</p>
          {Array.from({ length: children }).map((_, i) => (
            <select key={i} className="child-age-select" value={childAges[i] || ""} onChange={e => changeChildAge(i, e.target.value)}>
              <option value="">Age of Child {i + 1}</option>
              {Array.from({ length: 18 }, (_, a) => (
                <option key={a} value={a}>{a === 0 ? "Under 1" : `${a} year${a !== 1 ? "s" : ""} old`}</option>
              ))}
            </select>
          ))}
        </div>
      )}
      <button className="btn-primary" style={{ width: "100%", padding: "10px", marginTop: 12 }} onClick={onClose}>Done</button>
    </div>
  )
}

const HotelsPage = ({ onOpenAuth }) => {
  const navigate = useNavigate()
  const [urlParams] = useSearchParams()
  const dropdownRef = useRef(null)
  const cityRef     = useRef(null)

  const [location,  setLocation]  = useState(urlParams.get("location") || "")
  const [cityOpen,  setCityOpen]  = useState(false)
  const [checkin,   setCheckin]   = useState(urlParams.get("checkin")  || "")
  const [checkout,  setCheckout]  = useState(urlParams.get("checkout") || "")
  const [rooms,     setRooms]     = useState(1)
  const [adults,    setAdults]    = useState(Number(urlParams.get("adults"))   || 2)
  const [children,  setChildren]  = useState(Number(urlParams.get("children")) || 0)
  const [childAges, setChildAges] = useState([])
  const [guestOpen, setGuestOpen] = useState(false)

  const [minRating,    setMinRating]    = useState("")
  const [maxPrice,     setMaxPrice]     = useState(50000)
  const [amenityNames, setAmenityNames] = useState([])

  const [hotels,     setHotels]     = useState([])
  const [page,       setPage]       = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [activeSort, setActiveSort] = useState("recommended")

  const filteredCities = CITIES.filter(c =>
    !location.trim() ||
    c.name.toLowerCase().startsWith(location.toLowerCase()) ||
    c.state.toLowerCase().startsWith(location.toLowerCase())
  ).slice(0, 6)

  // Close guest dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setGuestOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Close city dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    if (location.trim() || minRating || amenityNames.length > 0) {
      runFilter(location, minRating, amenityNames)
    } else {
      fetchAllHotels()
    }
  }, [page]) // eslint-disable-line

  const fetchAllHotels = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${BASE}/api/hotel/get-allhotel?page=${page}&size=6`)
      setHotels((res.data.data) ? res.data.data : [])
      setTotalPages(res.data.totalPages || 0)
    } catch {
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  const runFilter = async (loc, rating, amenities) => {
    setLoading(true)
    try {
      const body = {}
      if (loc && loc.trim())             body.location     = loc.trim()
      if (rating && Number(rating) > 0)  body.rating       = Number(rating)
      if (amenities && amenities.length) body.amenityNames = amenities.map(a => a.toLowerCase())
      const res = await axios.post(`${BASE}/api/hotel/get/filter`, body)
      setHotels((res.data) ? res.data : [])
      setTotalPages(1)
      setPage(0)
    } catch {
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => runFilter(location, minRating, amenityNames)

  const clearFilters = () => {
    setMinRating(""); setAmenityNames([]); setMaxPrice(50000); setPage(0); setLocation("")
    fetchAllHotels()
  }

  const toggleAmenity = name =>
    setAmenityNames(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])

  const sorted = [...hotels].sort((a, b) => activeSort === "rating" ? b.ratings - a.ratings : 0)

  const guestLabel = `${adults} Adult${adults !== 1 ? "s" : ""} · ${children} Child${children !== 1 ? "ren" : ""} · ${rooms} Room${rooms !== 1 ? "s" : ""}`

  const handleHotelClick = hotel =>
    navigate(`/hotels/${hotel.hotelId}?checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}`)

  const handleViewRooms = (e, hotel) => {
    e.stopPropagation()
    navigate(`/hotels/${hotel.hotelId}/rooms/v1?checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}`)
  }

  return (
    <div className="page-fade">
      {/* Search Bar */}
      <div className="search-page-bar">
        <div className="search-bar-inner">
          <div className="search-bar-h">Explore Stays</div>
          <div className="search-bar-grid">

            {/* ── Destination — HomePage-style typeahead ── */}
            <div ref={cityRef} style={{ position: "relative" }}>
              <label className="search-bar-lbl">Destination</label>
              <input
                className="search-bar-input"
                placeholder="City, hotel, landmark…"
                value={location}
                autoComplete="off"
                onChange={e => { setLocation(e.target.value); setCityOpen(true) }}
                onFocus={() => setCityOpen(true)}
                onKeyDown={e => e.key === "Enter" && applyFilters()}
              />
              {cityOpen && filteredCities.length > 0 && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                  background: "#fff", border: "1.5px solid #b0a080",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)", borderRadius: 6, zIndex: 200,
                }}>
                  {filteredCities.map((city, idx) => (
                    <div
                      key={city.name}
                      style={{
                        padding: "10px 14px", fontSize: 13, cursor: "pointer",
                        display: "flex", justifyContent: "space-between",
                        borderBottom: idx < filteredCities.length - 1 ? "0.5px solid var(--border)" : "none",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--warm)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      onClick={() => { setLocation(city.name); setCityOpen(false) }}
                    >
                      <span>{city.name}</span>
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{city.state}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="search-bar-lbl">Check-in</label>
              <input className="search-bar-input" type="date" value={checkin} onChange={e => setCheckin(e.target.value)} />
            </div>

            <div>
              <label className="search-bar-lbl">Check-out</label>
              <input className="search-bar-input" type="date" value={checkout} onChange={e => setCheckout(e.target.value)} />
            </div>

            <div ref={dropdownRef} style={{ position: "relative" }}>
              <label className="search-bar-lbl">Guests</label>
              <input
                className="search-bar-input"
                readOnly
                value={guestLabel}
                onClick={() => setGuestOpen(g => !g)}
                style={{ cursor: "pointer" }}
              />
              {guestOpen && (
                <GuestDropdown
                  rooms={rooms} setRooms={setRooms}
                  adults={adults} setAdults={setAdults}
                  children={children} setChildren={setChildren}
                  childAges={childAges} setChildAges={setChildAges}
                  onClose={() => setGuestOpen(false)}
                />
              )}
            </div>

            <button className="search-update-btn" onClick={applyFilters}>Search</button>
          </div>
        </div>
      </div>

      <div className="search-body">
        {/* Filter Panel */}
        <div className="filter-panel">
          <div className="filter-card">
            <div className="filter-h">🎛️ Filters</div>

            <div className="filter-group">
              <span className="filter-group-label">Price per night</span>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span className="tkey">₹2,000</span>
                <span className="tkey">₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range" min={2000} max={50000} step={500}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--gold)" }}
              />
            </div>

            <div className="filter-group">
              <span className="filter-group-label">Min. Rating</span>
              <input
                className="input"
                type="number" min={1} max={5}
                placeholder="e.g. 4"
                value={minRating}
                onChange={e => setMinRating(e.target.value)}
                style={{ fontSize: 13, padding: "9px 12px" }}
              />
            </div>

            <div className="filter-group">
              <span className="filter-group-label">Amenities</span>
              {AMENITY_LIST.map(a => (
                <div key={a} className="filter-check-row">
                  <span style={{ fontSize: 13 }}>{a}</span>
                  <input
                    type="checkbox"
                    checked={amenityNames.includes(a)}
                    onChange={() => toggleAmenity(a)}
                    style={{ accentColor: "var(--gold)", width: 15, height: 15 }}
                  />
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ width: "100%", padding: "11px" }} onClick={applyFilters}>
              Apply Filters
            </button>
            {(amenityNames.length > 0 || minRating || location) && (
              <button className="btn-secondary" style={{ width: "100%", marginTop: 8, padding: "10px" }} onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="results-header">
            <div className="results-count">
              <strong>{sorted.length} properties</strong>
              {location ? ` in "${location}"` : " across India"}
            </div>
            <select className="sort-select-styled" value={activeSort} onChange={e => setActiveSort(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

          {!loading && sorted.length === 0 && (
            <div className="empty-state card" style={{ padding: "60px 24px" }}>
              <div className="empty-icon">🏨</div>
              <div className="empty-h">No hotels found</div>
              <p className="empty-p">Try adjusting your filters or search a different location.</p>
              <button className="btn-secondary" style={{ padding: "10px 20px" }} onClick={clearFilters}>Clear all filters</button>
            </div>
          )}

          {!loading && sorted.length > 0 && (
            <div className="results-list">
              {sorted.map((hotel, i) => (
                <div key={hotel.hotelId} className="result-card" onClick={() => handleHotelClick(hotel)}>
                  <div
                    className="result-img"
                    style={{ background: GRADIENTS[i % GRADIENTS.length], cursor: "pointer" }}
                    title="Click to view hotel details"
                  >
                    {EMOJIS[i % EMOJIS.length]}
                    <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 2 }}>
                      <span className="badge badge-green">Free cancellation</span>
                    </div>
                  </div>

                  <div className="result-body">
                    <div className="result-name">{hotel.hotelName}</div>
                    <div className="result-loc">📍 {hotel.location}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span className="stars">{"★".repeat(Math.min(hotel.ratings, 5))}</span>
                      <strong style={{ fontSize: 13 }}>{hotel.ratings}</strong>
                      <span className="tkey">(Verified)</span>
                    </div>
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="result-amenities">
                        {hotel.amenities.slice(0, 5).map((a, ai) => (
                          <span key={ai} className="chip">{a.name}</span>
                        ))}
                      </div>
                    )}
                    <p className="result-desc">{hotel.description}</p>
                  </div>

                  <div className="result-right">
                    <div style={{ textAlign: "right" }}>
                      <div className="rating-box">{hotel.ratings}</div>
                      <div className="rating-label">
                        {hotel.ratings >= 4 ? "Excellent" : hotel.ratings >= 3 ? "Very Good" : "Good"}
                      </div>
                      <div className="rating-reviews">Verified</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <button
                        className="btn-primary"
                        style={{ padding: "10px 20px", marginBottom: 8 }}
                        onClick={e => handleViewRooms(e, hotel)}
                      >
                        View Rooms
                      </button>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>Click card for details</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
              <button className="btn-secondary" style={{ padding: "9px 18px" }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span className="tkey">Page {page + 1} of {totalPages}</span>
              <button className="btn-secondary" style={{ padding: "9px 18px" }} disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HotelsPage