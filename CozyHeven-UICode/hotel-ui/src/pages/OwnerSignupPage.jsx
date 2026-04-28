import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

import {
  FaUser, FaEnvelope, FaLock, FaHotel,
  FaMapMarkerAlt, FaUserTag, FaStar,
} from "react-icons/fa"

import "../styles/pages.css"
import "../styles/components.css"

const BASE = "http://localhost:8080"

/* ── Field-level validation ── */
const validateAll = (owner, hotel) => {
  const err = {}
  if (!owner.name.trim()) err.name = "Full name is required."
  if (!owner.username.trim()) err.username = "Username is required."
  else if (owner.username.trim().length < 3) err.username = "Must be at least 3 characters."
  if (!owner.email.trim()) err.email = "Email is required."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email)) err.email = "Enter a valid email."
  if (owner.password.length < 5) err.password = "Minimum 5 characters."
  if (owner.password !== owner.confirmPassword) err.confirmPassword = "Passwords do not match."
  if (!hotel.hotelName.trim()) err.hotelName = "Hotel name is required."
  if (!hotel.location.trim()) err.location = "Location is required."
  return err
}

/* ── Star Picker ── */
const StarPicker = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        style={{
          fontSize: 24, background: "none", border: "none",
          cursor: "pointer", padding: 0,
          color: s <= value ? "#c9a84c" : "#ccc",
          transition: "color .15s",
        }}
      >★</button>
    ))}
    <span style={{ fontSize: 13, color: "#888", alignSelf: "center", marginLeft: 4 }}>
      {value} star{value !== 1 ? "s" : ""}
    </span>
  </div>
)


const OwnerSignupPage = () => {
  const navigate = useNavigate()

  const [owner, setOwner] = useState({
    name: "", username: "", email: "", password: "", confirmPassword: "",
  })
  const [hotel, setHotel] = useState({
    hotelName: "", location: "", description: "", ratings: 3,
  })

  const [fieldErr, setFieldErr] = useState({})
  const [errMsg, setErrMsg] = useState(undefined)
  const [successMsg, setSuccessMsg] = useState(undefined)
  const [loading, setLoading] = useState(false)

  /* clear per-field error on change */
  const setO = field => e => {
    setOwner(o => ({ ...o, [field]: e.target.value }))
    setFieldErr(prev => ({ ...prev, [field]: undefined }))
  }
  const setH = field => e => {
    setHotel(h => ({ ...h, [field]: e.target.value }))
    setFieldErr(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setErrMsg(undefined)
    setSuccessMsg(undefined)

    const errors = validateAll(owner, hotel)
    if (Object.keys(errors).length > 0) {
      setFieldErr(errors)
      setErrMsg("Please fix the errors below before submitting.")
      return
    }

    setLoading(true)
    try {
      await axios.post(BASE + "/api/hotel/owner/add", {
        name: owner.name.trim(),
        username: owner.username.trim(),
        email: owner.email.trim(),
        password: owner.password,
        hotelName: hotel.hotelName.trim(),
        location: hotel.location.trim(),
        description: hotel.description.trim(),
        ratings: Number(hotel.ratings),
      })
      setSuccessMsg("Account created successfully! Redirecting to sign in…")
      setTimeout(() => navigate("/"), 2000)
    } catch (err) {
      setErrMsg(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">

      {/* ── Navbar row ── */}
      <div className="row">
        <div className="col-lg-12 mb-4 text-center" style={{ paddingTop: 16 }}>
          <Link to="/" style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#1a1a1a", textDecoration: "none" }}>
            Cozy<span style={{ color: "#c9a84c" }}>Heven</span>
          </Link>
          <span style={{ fontSize: 13, color: "#888", marginLeft: 12 }}>
            Hotel Partner Registration
          </span>
        </div>
      </div>

      {/* ── Form row ── */}
      <div className="row mt-2">
        <div className="col-sm-3" />

        <div className="col-md-6">

          {/* ── CARD ── */}
          <div className="card">
            <div className="card-header">
              <FaUser style={{ marginRight: 8, color: "#c9a84c" }} />
              Owner &amp; Hotel Registration
            </div>

            <div className="card-body">

              {/* Alerts */}
              {errMsg && <div className="alert alert-danger  mt-3">{errMsg}</div>}
              {successMsg && <div className="alert alert-success mt-3">{successMsg}</div>}

              <form onSubmit={handleSubmit} noValidate>

                {/* ── SECTION: Account ── */}
                <p className="fw-semibold mt-3 mb-1" style={{ color: "#555" }}>
                  Account Details
                </p>

                {/* Full Name */}
                <div className="mt-3">
                  <label>
                    <FaUser style={{ marginRight: 6, color: "#c9a84c", fontSize: 12 }} />
                    Full Name:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${fieldErr.name ? "is-invalid" : ""}`}
                    value={owner.name}
                    onChange={setO("name")}
                  />
                  {fieldErr.name && <div className="invalid-feedback">{fieldErr.name}</div>}
                </div>

                {/* Username + Email */}
                <div className="row mt-3">
                  <div className="col-6">
                    <label>
                      <FaUserTag style={{ marginRight: 6, color: "#c9a84c", fontSize: 12 }} />
                      Username:
                    </label>
                    <input
                      type="text"
                      className={`form-control ${fieldErr.username ? "is-invalid" : ""}`}
                      value={owner.username}
                      onChange={setO("username")}
                      minLength={3}
                      maxLength={20}
                    />
                    {fieldErr.username && <div className="invalid-feedback">{fieldErr.username}</div>}
                  </div>
                  <div className="col-6">
                    <label>
                      <FaEnvelope style={{ marginRight: 6, color: "#c9a84c", fontSize: 12 }} />
                      Email:
                    </label>
                    <input
                      type="email"
                      className={`form-control ${fieldErr.email ? "is-invalid" : ""}`}
                      value={owner.email}
                      onChange={setO("email")}
                    />
                    {fieldErr.email && <div className="invalid-feedback">{fieldErr.email}</div>}
                  </div>
                </div>

                {/* Password + Confirm */}
                <div className="row mt-3">
                  <div className="col-6">
                    <label>
                      <FaLock style={{ marginRight: 6, color: "#c9a84c", fontSize: 12 }} />
                      Password:
                    </label>
                    <input
                      type="password"
                      className={`form-control ${fieldErr.password ? "is-invalid" : ""}`}
                      value={owner.password}
                      onChange={setO("password")}
                    />
                    {fieldErr.password && <div className="invalid-feedback">{fieldErr.password}</div>}
                  </div>
                  <div className="col-6">
                    <label>
                      <FaLock style={{ marginRight: 6, color: "#c9a84c", fontSize: 12 }} />
                      Confirm Password:
                    </label>
                    <input
                      type="password"
                      className={`form-control ${fieldErr.confirmPassword ? "is-invalid" : ""}`}
                      value={owner.confirmPassword}
                      onChange={setO("confirmPassword")}
                    />
                    {fieldErr.confirmPassword && <div className="invalid-feedback">{fieldErr.confirmPassword}</div>}
                  </div>
                </div>

                <hr />

                {/* ── SECTION: Hotel ── */}
                <p className="fw-semibold mb-1" style={{ color: "#555" }}>
                  <FaHotel style={{ marginRight: 8, color: "#c9a84c" }} />
                  Hotel Details
                </p>

                {/* Hotel Name + Location */}
                <div className="row mt-3">
                  <div className="col-6">
                    <label>
                      <FaHotel style={{ marginRight: 6, color: "#c9a84c", fontSize: 12 }} />
                      Hotel Name:
                    </label>
                    <input
                      type="text"
                      className={`form-control ${fieldErr.hotelName ? "is-invalid" : ""}`}
                      value={hotel.hotelName}
                      onChange={setH("hotelName")}
                    />
                    {fieldErr.hotelName && <div className="invalid-feedback">{fieldErr.hotelName}</div>}
                  </div>
                  <div className="col-6">
                    <label>
                      <FaMapMarkerAlt style={{ marginRight: 6, color: "#c9a84c", fontSize: 12 }} />
                      Location:
                    </label>
                    <input
                      type="text"
                      className={`form-control ${fieldErr.location ? "is-invalid" : ""}`}
                      value={hotel.location}
                      onChange={setH("location")}
                    />
                    {fieldErr.location && <div className="invalid-feedback">{fieldErr.location}</div>}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-3">
                  <label>Description:</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={hotel.description}
                    onChange={setH("description")}
                  />
                </div>

                {/* Star Rating */}
                <div className="mt-3">
                  <label>
                    <FaStar style={{ marginRight: 6, color: "#c9a84c", fontSize: 12 }} />
                    Star Rating (1–5):
                  </label>
                  <StarPicker
                    value={hotel.ratings}
                    onChange={v => setHotel(h => ({ ...h, ratings: v }))}
                  />
                </div>

                <hr />

                {/* Submit */}
                <div className="mt-3 mb-4">
                  <input
                    type="submit"
                    className="btn btn-primary w-100"
                    value={loading ? "Creating your account…" : "Create Account & Register Hotel"}
                    disabled={loading}
                  />
                </div>

                <div className="text-center" style={{ fontSize: 13, color: "#888" }}>
                  Already have an account?{" "}
                  <button type="button" className="btn btn-link p-0" style={{ fontSize: 13 }} onClick={() => navigate("/")}>
                    Sign in here
                  </button>
                </div>

                <div className="text-center mt-1" style={{ fontSize: 12, color: "#888" }}>
                  Are you a guest?{" "}
                  <button type="button" className="btn btn-link p-0" style={{ fontSize: 12 }} onClick={() => navigate("/")}>
                    Guest registration →
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-3" />
      </div>

      {/* ── Footer row ── */}
      <div className="row mt-4">
        <div className="col-lg-12 text-center mb-4" style={{ fontSize: 12, color: "#aaa" }}>
          © 2026 CozyHeven. All rights reserved.
        </div>
      </div>

    </div>
  )
}

export default OwnerSignupPage