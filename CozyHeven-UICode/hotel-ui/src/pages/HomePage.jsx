import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
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
const EMOJIS = ["🏰", "🌊", "🏩", "🏯", "🌇", "🌃"]

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

const HomePage = ({ onOpenAuth }) => {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const cityRef = useRef(null)

  const [location, setLocation] = useState("")
  const [checkin, setCheckin] = useState("")
  const [checkout, setCheckout] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [guestOpen, setGuestOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [featuredHotels, setFeaturedHotels] = useState([])
  const [loadingHotels, setLoadingHotels] = useState(true)

  const filteredCities = CITIES.filter(c =>
    !location.trim() ||
    c.name.toLowerCase().startsWith(location.toLowerCase()) ||
    c.state.toLowerCase().startsWith(location.toLowerCase())
  ).slice(0, 6)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setGuestOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(`${BASE}/api/hotel/get-allhotel?page=0&size=3`)
        setFeaturedHotels((res.data.data) ? res.data.data : [])
      } catch {
        setFeaturedHotels([])
      } finally {
        setLoadingHotels(false)
      }
    }
    fetchHotels()
  }, [])

  const guestLabel = `${adults} Adult${adults !== 1 ? "s" : ""}${children > 0 ? ` · ${children} Child${children !== 1 ? "ren" : ""}` : ""}`

  const handleSearch = () => {
    const params = new URLSearchParams({
      location: location.trim(),
      checkin,
      checkout,
      adults: String(adults),
      children: String(children),
    })
    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <div className="page-fade">

      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-h">
            Find Your <em>Perfect</em><br />Place to Stay
          </h1>
          <p className="hero-sub">
            Discover handpicked luxury hotels, boutique retreats and hidden gems
            across India — with free cancellation on most bookings.
          </p>
          <div className="hero-btns">
            <button className="btn-primary lg" onClick={handleSearch}>Explore Stays</button>
            <button className="hero-btn-outline" onClick={() => onOpenAuth("register")}>Join for Free</button>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="search-box container">
        <div className="search-box-grid">

          {/* Destination */}
          <div className="search-field" ref={cityRef} style={{ position: "relative" }}>
            <label className="lbl">Destination</label>
            <input
              className="input"
              placeholder="City, hotel, landmark…"
              value={location}
              autoComplete="off"
              onChange={e => { setLocation(e.target.value); setCityOpen(true) }}
              onFocus={() => setCityOpen(true)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            {cityOpen && filteredCities.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                background: "#fff", border: "1.5px solid #b0a080",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 200,
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

          {/* Check-in */}
          <div className="search-field">
            <label className="lbl">Check-in</label>
            <input
              className="input"
              type="date"
              value={checkin}
              min={new Date().toISOString().split("T")[0]}
              onChange={e => setCheckin(e.target.value)}
            />
          </div>

          {/* Check-out */}
          <div className="search-field">
            <label className="lbl">Check-out</label>
            <input
              className="input"
              type="date"
              value={checkout}
              min={checkin || new Date().toISOString().split("T")[0]}
              onChange={e => setCheckout(e.target.value)}
            />
          </div>

          {/* Guests */}
          <div className="search-field" ref={dropdownRef}>
            <label className="lbl">Guests</label>
            <input
              className="input"
              readOnly
              value={guestLabel}
              onClick={() => setGuestOpen(o => !o)}
              style={{ cursor: "pointer" }}
            />
            {guestOpen && (
              <div className="guest-dropdown">
                {[
                  { field: "adults",   label: "Adults",   sub: "Age 18+", min: 1 },
                  { field: "children", label: "Children", sub: "Age 0–17", min: 0 },
                ].map(({ field, label, sub, min }) => (
                  <div key={field} className="guest-row">
                    <div>
                      <div className="guest-label">{label}</div>
                      <div className="guest-sub">{sub}</div>
                    </div>
                    <div className="guest-counter">
                      <button
                        className="guest-btn"
                        disabled={field === "adults" ? adults <= 1 : children <= 0}
                        onClick={() => field === "adults" ? setAdults(a => Math.max(1, a - 1)) : setChildren(c => Math.max(0, c - 1))}
                      >−</button>
                      <span className="guest-count">{field === "adults" ? adults : children}</span>
                      <button
                        className="guest-btn"
                        onClick={() => field === "adults" ? setAdults(a => a + 1) : setChildren(c => c + 1)}
                      >+</button>
                    </div>
                  </div>
                ))}
                <button className="btn-primary" style={{ width: "100%", marginTop: 10, padding: "9px" }} onClick={() => setGuestOpen(false)}>
                  Done
                </button>
              </div>
            )}
          </div>

          <button className="search-btn" onClick={handleSearch}>🔍 Search</button>
        </div>
      </div>

      {/* Featured Hotels */}
      <div className="hotels-section">
        <div className="hotels-section-head">
          <div>
            <span className="section-tag">Featured Properties</span>
            <h2 className="section-h">Top Picks</h2>
          </div>
          <button className="btn-secondary" onClick={handleSearch}>View All Hotels →</button>
        </div>

        {loadingHotels ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="hotels-grid">
            {featuredHotels.map((h, i) => (
              <div key={h.hotelId} className="hotel-card" onClick={() => navigate(`/hotels/${h.hotelId}`)}>
                <div className="hotel-card-img" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                  <span style={{ fontSize: 40 }}>{EMOJIS[i % EMOJIS.length]}</span>
                  <div className="hotel-card-badge">
                    <span className="badge badge-gold">{"★".repeat(Math.min(h.ratings, 5))}</span>
                  </div>
                  <button className="hotel-card-fav" onClick={e => e.stopPropagation()}>🤍</button>
                </div>
                <div className="hotel-card-body">
                  <div className="hotel-card-name">{h.hotelName}</div>
                  <div className="hotel-card-loc">📍 {h.location}</div>
                  <div className="hotel-card-meta">
                    <span className="stars">{"★".repeat(Math.min(h.ratings, 5))}{"☆".repeat(Math.max(0, 5 - h.ratings))}</span>
                    <span className="hotel-rating-score">{h.ratings} / 5</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>
                    {h.description ? h.description.slice(0, 70) + "…" : "A wonderful place to stay."}
                  </p>
                  <div className="hotel-card-footer">
                    <div>
                      <div className="hotel-price-from">Starting from</div>
                      <div className="price-med">View Rooms</div>
                    </div>
                    <span className="badge badge-green">Free Cancel</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="cta-banner">
        <div className="cta-inner">
          <h2 className="cta-h">Ready to find your CozyHeven?</h2>
          <p className="cta-sub">Discover handpicked hotels across India with the best prices guaranteed.</p>
          <div className="cta-btns">
            <button className="btn-primary lg" onClick={() => onOpenAuth("register")}>Create free account</button>
            <button className="hero-btn-outline" onClick={handleSearch}>Browse stays</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-logo">Cozy<span>Heven</span></div>
          <div className="footer-links">
            {["About", "Careers", "Privacy", "Terms", "Support", "List your property"].map(l => (
              <span key={l} className="footer-link">{l}</span>
            ))}
          </div>
        </div>
        <div className="footer-copy">© 2026 CozyHeven. All rights reserved.</div>
      </footer>

    </div>
  )
}

export default HomePage