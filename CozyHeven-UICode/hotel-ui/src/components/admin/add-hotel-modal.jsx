import axios from "axios"
import { useState } from "react"
import { adminStyles as s } from "../../styles/admin-styles"

const BASE = "http://localhost:8080"

const AddHotelModal = ({ onClose, onSaved }) => {
    const [form,    setForm]    = useState({ hotelName: "", location: "", description: "", ratings: "" })
    const [loading, setLoading] = useState(false)
    const [errMsg,  setErrMsg]  = useState("")

    const token = localStorage.getItem("token")

    const setF = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

    const handleSave = async () => {
        if (!form.hotelName.trim()) { setErrMsg("Hotel name required."); return }
        if (!form.location.trim())  { setErrMsg("Location required.");   return }
        setLoading(true); setErrMsg("")
        try {
            await axios.post(`${BASE}/api/hotel/add`,
                { ...form, ratings: Number(form.ratings) },
                { headers: { Authorization: "Bearer " + token } }
            )
            onSaved("Hotel added successfully.")
        } catch (e) {
            setErrMsg(e.response?.data?.message || "Failed to add hotel.")
        } finally { setLoading(false) }
    }

    return (
        <div style={s.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={s.modal}>
                <button style={s.modalClose} onClick={onClose}>✕</button>
                <div style={s.modalTitle}>Add <span style={{ color: "#c9a84c" }}>Hotel</span></div>

                {errMsg && <div style={s.alertDanger}>{errMsg}</div>}

                {[
                    { key: "hotelName", label: "Hotel Name *",      type: "text"   },
                    { key: "location",  label: "Location *",        type: "text"   },
                    { key: "ratings",   label: "Star Rating (1–5)", type: "number" },
                ].map(({ key, label, type }) => (
                    <div key={key} style={s.formGroup}>
                        <label style={s.label}>{label}</label>
                        <input style={s.input} type={type} min={1} max={5}
                            value={form[key]} onChange={setF(key)} />
                    </div>
                ))}

                <div style={s.formGroup}>
                    <label style={s.label}>Description</label>
                    <textarea style={s.textarea} rows={3} value={form.description} onChange={setF("description")} />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button style={{ ...s.primaryBtn, flex: 1, padding: "12px" }}
                        onClick={handleSave} disabled={loading}>
                        {loading ? "Adding…" : "Add Hotel"}
                    </button>
                    <button style={{ ...s.secondaryBtn, padding: "12px 20px" }} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AddHotelModal