import { useState } from "react";
import axios from "axios";
import "../../styles/modal.css";
import "../../styles/components.css";

const BASE        = "http://localhost:8080";
const LOGIN_API   = `${BASE}/api/auth/logins`;      
const DETAILS_API = `${BASE}/api/auth/user-details`;

export default function AuthModal({ isOpen, defaultTab, onClose, onSuccess }) {
  const [tab,       setTab]       = useState(defaultTab || "login");
  const [errMsg,    setErrMsg]    = useState("");
  const [loading,   setLoading]   = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [reg,       setReg]       = useState({
    fname: "", lname: "", email: "", city: "",
    username: "", password: "", confirmPassword: "",
  });

  if (!isOpen) return null;

  const setR = (field) => (e) => setReg({ ...reg, [field]: e.target.value });

  /* ── LOGIN ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrMsg("");
    if (!loginUser) { setErrMsg("Please enter your username"); return; }
    if (!loginPass) { setErrMsg("Please enter your password"); return; }
    setLoading(true);

    try {
     
      const encoded  = window.btoa(loginUser + ":" + loginPass);
      const tokenRes = await axios.get(LOGIN_API, {
        headers: { Authorization: "Basic " + encoded },
      });

      const token =  tokenRes.data.Token;    

      if (!token) {
        console.error("Token response:", tokenRes.data);
        setErrMsg("Login failed — no token returned.");
        return;
      }

      localStorage.setItem("token", token);

      /* Step 2 — Bearer token → get role + username */
      const detailRes = await axios.get(DETAILS_API, {
        headers: { Authorization: "Bearer " + token },
      });

      const role = detailRes.data.role || "GUEST";
      localStorage.setItem("username", detailRes.data.username || loginUser);
      localStorage.setItem("email",    detailRes.data.email    || "");
      localStorage.setItem("role",     role);

      onSuccess(role);  
      onClose();

    } catch (err) {
      console.error("Login error:", err.response?.status, err.response?.data || err.message);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setErrMsg("Invalid username or password. Please try again.");
      } else {
        setErrMsg(err.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── REGISTER ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrMsg("");
    if (!reg.fname || !reg.lname)              { setErrMsg("Please enter your full name");          return; }
    if (!reg.email)                            { setErrMsg("Please enter your email");              return; }
    if (!reg.username)                         { setErrMsg("Please choose a username");             return; }
    if (reg.password.length < 6)               { setErrMsg("Password must be at least 6 chars");   return; }
    if (reg.password !== reg.confirmPassword)  { setErrMsg("Passwords do not match");              return; }
    setLoading(true);
    try {
      await axios.post(`${BASE}/api/guest/sign-up`, {
        name:     reg.fname + " " + reg.lname,
        email:    reg.email,
        city:     reg.city,
        username: reg.username,
        password: reg.password,
      });
      setTab("login");
      setErrMsg("");
      setLoginUser(reg.username);
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => { setTab(t); setErrMsg(""); };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">Cozy<span>Heven</span></div>

        <div className="auth-tabs">
          <div className={`auth-tab ${tab === "login"    ? "active" : ""}`} onClick={() => switchTab("login")}>Sign In</div>
          <div className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => switchTab("register")}>Create Account</div>
        </div>

        {errMsg && <div className="alert alert-danger">{errMsg}</div>}

        {/* ── SIGN IN ── */}
        {tab === "login" && (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="lbl">Username</label>
              <input className="input" placeholder="your_username" value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="lbl">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)} required />
              <span className="forgot-link">Forgot password?</span>
            </div>
            <button type="submit" className="btn-primary full" style={{ padding: "14px", fontSize: "15px" }} disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
            <div className="auth-divider">or continue with</div>
            <div className="auth-social-row">
              <button type="button" className="social-btn">G Google</button>
              <button type="button" className="social-btn">f Facebook</button>
            </div>
            <div className="auth-switch">
              Don't have an account?{" "}
              <button type="button" className="auth-switch-btn" onClick={() => switchTab("register")}>Register free</button>
            </div>
          </form>
        )}

        {/* ── CREATE ACCOUNT ── */}
        {tab === "register" && (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-grid" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label className="lbl">First Name</label>
                <input className="input" placeholder="Aarav" value={reg.fname} onChange={setR("fname")} required />
              </div>
              <div className="form-group">
                <label className="lbl">Last Name</label>
                <input className="input" placeholder="Sharma" value={reg.lname} onChange={setR("lname")} required />
              </div>
            </div>
            <div className="form-group">
              <label className="lbl">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={reg.email} onChange={setR("email")} required />
            </div>
            <div className="form-group">
              <label className="lbl">City</label>
              <input className="input" placeholder="Mumbai" value={reg.city} onChange={setR("city")} />
            </div>
            <div className="form-group">
              <label className="lbl">Username</label>
              <input className="input" placeholder="aarav_sharma" value={reg.username} onChange={setR("username")} required minLength={3} maxLength={15} />
            </div>
            <div className="form-grid" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label className="lbl">Password</label>
                <input className="input" type="password" placeholder="Min. 6 chars" value={reg.password} onChange={setR("password")} required />
              </div>
              <div className="form-group">
                <label className="lbl">Confirm</label>
                <input className="input" type="password" placeholder="Repeat password" value={reg.confirmPassword} onChange={setR("confirmPassword")} required />
              </div>
            </div>
            <button type="submit" className="btn-primary full" style={{ padding: "14px", fontSize: "15px" }} disabled={loading}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>
            <div className="terms-note">
              By registering you agree to our <a>Terms</a> and <a>Privacy Policy</a>
            </div>
            <div className="auth-switch">
              Already have an account?{" "}
              <button type="button" className="auth-switch-btn" onClick={() => switchTab("login")}>Sign in</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}