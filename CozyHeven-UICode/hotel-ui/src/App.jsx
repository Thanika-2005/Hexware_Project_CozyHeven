import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import AuthModal from "./components/auth/AuthModal";
import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import RoomsPage from "./pages/RoomsPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./components/admin/admin-dashboard"
import HotelOwnerDashboard from "./components/owner/hotel-owner-dashboard"
import OwnerSignupPage from "./pages/OwnerSignupPage";
import "./styles/global.css";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role") || "";

  if (!token) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [authModal,    setAuthModal]    = useState({ open: false, tab: "login" });
  const [toast,        setToast]        = useState("");
  // Store where the guest was trying to go before login was required
  const [pendingRoute, setPendingRoute] = useState(null);
  const navigate = useNavigate();

  // Call this with the full path+search string you want to go to after login
  // e.g. openAuth("login", "/book/42?checkin=2025-12-01&checkout=2025-12-03&...")
  const openAuth  = (tab = "login", intendedPath = null) => {
    if (intendedPath) setPendingRoute(intendedPath);
    setAuthModal({ open: true, tab });
  };
  const closeAuth = () => setAuthModal({ open: false, tab: "login" });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const onAuthSuccess = (role) => {
    closeAuth();
    showToast("Welcome back!");
    setTimeout(() => {
      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role === "HOTEL_OWNER") {
        navigate("/owner", { replace: true });
      } else if (pendingRoute) {
        // Guest had a pending booking — go there instead of /hotels
        const dest = pendingRoute;
        setPendingRoute(null);
        navigate(dest, { replace: true });
      } else {
        navigate("/hotels", { replace: true });
      }
    }, 50);
  };

  return (
    <>
      <Navbar onOpenAuth={openAuth} />

      <Routes>
        {/* PUBLIC */}
        <Route path="/"                      element={<HomePage onOpenAuth={openAuth} />} />
        <Route path="/hotels"                element={<HotelsPage onOpenAuth={openAuth} />} />
        <Route path="/hotels/:hotelId"       element={<HotelDetailPage onOpenAuth={openAuth} />} />
        <Route path="/hotels/:hotelId/rooms/v1" element={<RoomsPage onOpenAuth={openAuth} />} />
        <Route path="/register/owner"        element={<OwnerSignupPage />} />

        {/* GUEST PROTECTED */}
        <Route path="/book/:roomId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/my-bookings"  element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* ADMIN */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* HOTEL OWNER */}
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={["HOTEL_OWNER"]}>
            <HotelOwnerDashboard />
          </ProtectedRoute>
        } />

        {/* legacy redirect */}
        <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>

      <AuthModal
        isOpen={authModal.open}
        defaultTab={authModal.tab}
        onClose={closeAuth}
        onSuccess={onAuthSuccess}
      />

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}