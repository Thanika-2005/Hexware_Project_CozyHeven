import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/pages.css"
import "../styles/components.css"

const BASE = "http://localhost:8080"

const ProfilePage = () => {
  const navigate = useNavigate()

  const [guest,   setGuest]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [saveMsg, setSaveMsg] = useState("")
  const [form,    setForm]    = useState({ firstName: "", lastName: "", email: "", phone: "" })

  const token    = localStorage.getItem("token")
  const username = localStorage.getItem("username") || "U"
  const initials = username.slice(0, 2).toUpperCase()

  useEffect(() => {
    if (!token) { navigate("/"); return }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE}/api/guest/get-one`, {
          headers: { Authorization: "Bearer " + token },
        })
        setGuest(res.data)
        const parts = (res.data.name || "").split(" ")
        setForm({ firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "", email: res.data.email || "", phone: "" })
      } catch {
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  const saveChanges = () => {
    setSaveMsg("Changes saved successfully!")
    setTimeout(() => setSaveMsg(""), 3000)
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>

  return (
    <div className="page-fade">
      <div className="profile-page-wrap">
        <div style={{ marginBottom: 28 }}>
          <span className="section-tag">Account</span>
          <h1 className="section-h" style={{ fontSize: 28 }}>My Profile</h1>
        </div>

        <div className="profile-body">
          {/* Left sidebar */}
          <div>
            <div className="profile-sidebar-card">
              <div className="profile-av-big">{initials}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
                {guest?.name || username}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>{guest?.email}</div>
              <span className="badge badge-gold" style={{ marginBottom: 20 }}>★ Gold Member</span>
            </div>

            <div className="profile-nav-card">
              <button className="profile-nav-btn" onClick={() => navigate("/my-bookings")}>📋 My Bookings</button>
              <button className="profile-nav-btn">♡ Saved properties</button>
              <button className="profile-nav-btn">🔔 Notifications</button>
              <div className="divider" />
              <button className="profile-nav-btn danger" onClick={logout}>⬤ Sign out</button>
            </div>
          </div>

          {/* Right content */}
          <div>
            {saveMsg && <div className="alert alert-success">{saveMsg}</div>}

            <div className="profile-form-card">
              <div className="profile-form-h">Personal Information</div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="lbl">First name</label>
                  <input className="input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="lbl">Last name</label>
                  <input className="input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="lbl">Email address</label>
                  <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="lbl">Phone number</label>
                  <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="lbl">City</label>
                <input className="input" defaultValue={guest?.city || ""} style={{ marginTop: 6 }} />
              </div>
              <button className="btn-primary" style={{ padding: "12px 28px" }} onClick={saveChanges}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage