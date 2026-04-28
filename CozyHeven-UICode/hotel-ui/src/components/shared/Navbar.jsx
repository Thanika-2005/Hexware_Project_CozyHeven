import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/navbar.css";

export default function Navbar({ onOpenAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const token    = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "";
  const email    = localStorage.getItem("email")    || "";
  const role     = localStorage.getItem("role")     || "";
  const initials = username.slice(0, 2).toUpperCase() || "U";

  const isActive = (path) => location.pathname.startsWith(path);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">Cozy<span>Heven</span></Link>

        <div className="nav-links">
          <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">Home</Link>
          <Link className={`nav-link ${isActive("/hotels") ? "active" : ""}`} to="/hotels">Explore</Link>

          {/* GUEST links */}
          {token && role === "GUEST" && (
            <>
              <Link className={`nav-link ${isActive("/my-bookings") ? "active" : ""}`} to="/my-bookings">My Bookings</Link>
              <Link className={`nav-link ${isActive("/profile") ? "active" : ""}`}     to="/profile">Profile</Link>
            </>
          )}

          {/* HOTEL OWNER links */}
          {token && role === "HOTEL_OWNER" && (
            <Link className={`nav-link ${isActive("/owner") ? "active" : ""}`} to="/owner">
              Dashboard
            </Link>
          )}

          {/* ADMIN links */}
          {token && role === "ADMIN" && (
            <Link className={`nav-link ${isActive("/admin") ? "active" : ""}`} to="/admin">
              Admin Panel
            </Link>
          )}

          {/* Show "List your hotel" only when NOT logged in */}
          {!token && (
            <Link className="nav-link" to="/register/owner">Hotel Owner Signup</Link>
          )}
        </div>

        {!token ? (
          <div className="nav-actions">
            <button className="btn-nav-login"    onClick={() => onOpenAuth("login")}>Sign In</button>
            <button className="btn-nav-register" onClick={() => onOpenAuth("register")}>Register</button>
          </div>
        ) : (
          <div ref={menuRef} style={{ position: "relative" }}>
            <div className="user-pill" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="user-av">{initials}</div>
              <span className="user-pill-name">{username}</span>
              <span className="user-pill-caret">▾</span>
            </div>

            {menuOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown-head">
                  <div className="user-dropdown-name">{username}</div>
                  <div className="user-dropdown-email">{email}</div>
                  {/* Role badge */}
                  <div style={{ marginTop: 4 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: ".06em", padding: "2px 8px", borderRadius: 20,
                      background: role === "ADMIN" ? "var(--red)" : role === "HOTEL_OWNER" ? "var(--gold)" : "var(--green)",
                      color: "#fff",
                    }}>
                      {role === "ADMIN" ? "Admin" : role === "HOTEL_OWNER" ? "Hotel Owner" : "Guest"}
                    </span>
                  </div>
                </div>

                {/* GUEST dropdown items */}
                {role === "GUEST" && (
                  <>
                    <button className="user-dropdown-item" onClick={() => { navigate("/profile");     setMenuOpen(false); }}>👤 My Profile</button>
                    <button className="user-dropdown-item" onClick={() => { navigate("/my-bookings"); setMenuOpen(false); }}>📋 My Bookings</button>
                  </>
                )}

                {/* HOTEL OWNER dropdown items */}
                {role === "HOTEL_OWNER" && (
                  <button className="user-dropdown-item" onClick={() => { navigate("/owner"); setMenuOpen(false); }}>🏨 My Dashboard</button>
                )}

                {/* ADMIN dropdown items */}
                {role === "ADMIN" && (
                  <button className="user-dropdown-item" onClick={() => { navigate("/admin"); setMenuOpen(false); }}>⚙️ Admin Panel</button>
                )}

                <button className="user-dropdown-item danger" onClick={logout}>🚪 Sign Out</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}