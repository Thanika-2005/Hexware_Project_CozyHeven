import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
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

const STATIC_FACILITIES = [
  "Free Wi-Fi", "Front desk 24h", "Pool", "Spa", "Fitness centre",
  "Restaurant", "Bar", "Parking", "Airport shuttle", "Room service",
  "Air conditioning", "Non-smoking rooms",
]

const ScoreBar = ({ label, score }) => (
  <div className="rating-bar-row">
    <span className="rating-bar-label">{label}</span>
    <div className="rating-bar-track">
      <div className="rating-bar-fill" style={{ width: `${(score / 10) * 100}%` }} />
    </div>
    <span className="rating-bar-score">{score}</span>
  </div>
)

const HotelDetailPage = ({ onOpenAuth }) => {
  const { hotelId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [hotel,   setHotel]   = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const checkin  = searchParams.get("checkin")  || ""
  const checkout = searchParams.get("checkout") || ""
  const adults   = searchParams.get("adults")   || "2"
  const children = searchParams.get("children") || "0"

  const idx = Number(hotelId) % GRADIENTS.length


const loadReviews = async () => {
  try {
    const res = await axios.get(`${BASE}/api/review/hotel/${hotelId}`)
    setReviews((res.data) ? res.data : [])
  } catch {}
}

useEffect(() => {
  const loadData = async () => {
    setLoading(true)
    try {
      const [hotelRes, reviewRes] = await Promise.allSettled([
        axios.get(`${BASE}/api/hotel/get/${hotelId}`),
        axios.get(`${BASE}/api/review/hotel/${hotelId}`),
      ])
      if (hotelRes.status === "fulfilled") setHotel(hotelRes.value.data)
      if (reviewRes.status === "fulfilled") setReviews((reviewRes.value.data) ? reviewRes.value.data : [])
    } catch {
      navigate("/hotels")
    } finally {
      setLoading(false)
    }
  }
  loadData()
}, [hotelId])

  const goToRooms = () => {
    navigate(`/hotels/${hotelId}/rooms/v1?checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}`)
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : hotel?.ratings ?? "—"

  const ratingLabel = avgRating >= 9 ? "Outstanding" : avgRating >= 8 ? "Excellent" : avgRating >= 7 ? "Very Good" : "Good"

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (!hotel)  return null

  const amenities = hotel.amenities && hotel.amenities.length > 0
    ? hotel.amenities
    : STATIC_FACILITIES.map((n, i) => ({ id: i, name: n, icon: "✓" }))

  const highlights = hotel.description
    ? hotel.description.split(".").filter(s => s.trim().length > 20).slice(0, 4)
    : ["Great location", "Excellent service", "Premium facilities", "Free cancellation"]

  return (
    <div className="detail-page page-fade">
      {/* Hero */}
      <div className="detail-hero-img-wrap" style={{ background: GRADIENTS[idx] }}>
        <span className="detail-hero-emoji">{EMOJIS[idx]}</span>
        <div className="detail-hero-overlay" />

        <div className="detail-hero-top-bar">
          <button className="btn-ghost-white" onClick={() => navigate(-2)}>← Back</button>
          <div className="detail-hero-actions"></div>
        </div>

        <div className="detail-hero-bottom">
          <div className="detail-hotel-name">{hotel.hotelName}</div>
          <div className="detail-meta-row">
            <span className="stars" style={{ fontSize: 16 }}>{"★".repeat(Math.min(hotel.ratings, 5))}</span>
            <span className="detail-meta-rating-score">{hotel.ratings}</span>
            <span className="detail-meta-reviews">{reviews.length > 0 ? `(${reviews.length} reviews)` : "(Verified property)"}</span>
            <span style={{ color: "rgba(255,255,255,.4)" }}>·</span>
            <span className="detail-meta-loc">📍 {hotel.location}</span>
            <span className="badge badge-gold">Verified</span>
            {reviews.length >= 3 && <span className="badge" style={{ background: "rgba(30,107,64,.7)", color: "#9FE1CB" }}>Free cancellation</span>}
          </div>
        </div>
      </div>

      {/* High demand banner */}
      {reviews.length >= 3 && (
        <div style={{ background: "var(--red-bg)", borderBottom: "1px solid rgba(176,48,32,.15)", padding: "12px 40px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)" }}>This property is in high demand! </span>
              <span style={{ fontSize: 13, color: "var(--red)" }}>{reviews.length} guests have reviewed this property.</span>
            </div>
          </div>
        </div>
      )}

      {/* Main body */}
      <div className="detail-body-wrap">
        <div className="detail-main-col">

          {/* Highlights */}
          <div className="detail-section">
            <div className="detail-section-h">Highlights</div>
            <div className="highlights-list">
              {highlights.map((h, i) => {
                const icons = ["📍", "🍽️", "🎯", "☕", "✈️", "🏋️"]
                return (
                  <div key={i} className="highlight-item">
                    <span className="highlight-icon">{icons[i % icons.length]}</span>
                    <div>
                      <div className="highlight-title">{h.trim().slice(0, 60)}</div>
                      <div className="highlight-desc">Great for travellers staying at this property</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Facilities */}
          <div className="detail-section">
            <div className="detail-section-h">Facilities</div>
            <div className="facilities-grid">
              {amenities.slice(0, 12).map((a, i) => (
                <div key={a.id ?? i} className="facility-item">
                  <span className="facility-check">✓</span>
                  <span>{a.icon && a.icon !== "✓" ? `${a.icon} ` : ""}{a.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="detail-section">
            <div className="detail-section-h">About us</div>
            <p className="detail-desc-text">
              {hotel.description || "A premium property offering exceptional comfort and world-class amenities."}
            </p>
          </div>

          {/* Reviews */}
          <div className="detail-section">
            <div className="detail-section-h">
              Guest Reviews
              {reviews.length > 0 && (
                <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, fontWeight: 400, color: "var(--muted)", marginLeft: 10 }}>
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="no-reviews">No reviews yet — be the first to review after your stay!</div>
            ) : (
              <div className="reviews-list">
                {reviews.slice(0, 6).map(r => (
                  <div key={r.reviewId} className="review-card">
                    <div className="review-header">
                      <div className="review-author">
                        <div className="review-av">{r.username ? r.username.slice(0, 2).toUpperCase() : "G"}</div>
                        <div>
                          <div className="review-username">{r.username || "Guest"}</div>
                          <div className="review-date">{r.stayDate || "Recent stay"}</div>
                        </div>
                      </div>
                      <div className="review-score">{r.rating} / 5</div>
                    </div>
                    {r.title   && <div className="review-title">{r.title}</div>}
                    <div className="review-stars">{"★".repeat(r.rating)}</div>
                    {r.comment && <p className="review-comment">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar-col">
          {/* Rating summary */}
          <div className="rating-summary-card" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 16 }}>
              <div>
                <div className="rating-big-score">{avgRating}</div>
                <div className="rating-big-label">{ratingLabel}</div>
                <div className="rating-big-reviews">{reviews.length} reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                <ScoreBar label="Location"    score={hotel.ratings > 0 ? Math.min(10, hotel.ratings * 1.1).toFixed(1)  : 8.5} />
                <ScoreBar label="Cleanliness" score={hotel.ratings > 0 ? Math.min(10, hotel.ratings * 1.05).toFixed(1) : 8.5} />
                <ScoreBar label="Facilities"  score={hotel.ratings > 0 ? Math.min(10, hotel.ratings * 0.95).toFixed(1) : 8.0} />
                <ScoreBar label="Service"     score={hotel.ratings > 0 ? Math.min(10, hotel.ratings * 1.0).toFixed(1)  : 8.7} />
              </div>
            </div>
          </div>

          {/* Book card */}
          <div className="detail-book-card">
            <div className="detail-book-price-row">
              <div className="detail-book-from">Rooms from</div>
              <div className="price-big">₹—</div>
              <div className="tkey">per night · taxes extra</div>
            </div>
            <div className="divider" />
            <div className="detail-quick-facts">
              <div className="detail-quick-fact">
                <div className="detail-quick-fact-label">Check-in</div>
                <div className="detail-quick-fact-val">{checkin  || "Select"}</div>
              </div>
              <div className="detail-quick-fact">
                <div className="detail-quick-fact-label">Check-out</div>
                <div className="detail-quick-fact-val">{checkout || "Select"}</div>
              </div>
              <div className="detail-quick-fact">
                <div className="detail-quick-fact-label">Adults</div>
                <div className="detail-quick-fact-val">{adults}</div>
              </div>
              <div className="detail-quick-fact">
                <div className="detail-quick-fact-label">Children</div>
                <div className="detail-quick-fact-val">{children}</div>
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }} onClick={goToRooms}>
              View Available Rooms →
            </button>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "var(--green)", fontWeight: 600 }}>
              ✓ Free cancellation on most rooms
            </div>
          </div>

          {/* Location card */}
          <div className="detail-book-card">
            <div className="detail-section-h" style={{ fontSize: 15 }}>Location</div>
            <div style={{ height: 120, background: "var(--warm)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "1px solid var(--border)", marginBottom: 10 }}>
              📍
            </div>
            <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.5 }}>{hotel.location}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>Excellent location · Well-connected area</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelDetailPage