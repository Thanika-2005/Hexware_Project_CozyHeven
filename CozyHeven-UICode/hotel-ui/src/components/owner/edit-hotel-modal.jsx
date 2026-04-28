import axios from "axios"
import { useState } from "react"
import { ownerStyles as s } from "../../styles/owner-styles"

const BASE = "http://localhost:8080"

const EditHotelModal = ({ hotel, onClose, onSaved }) => {
    const [form, setForm] = useState({
        hotelName:   hotel.hotelName   || "",
        location:    hotel.location    || "",
        description: hotel.description || "",
        ratings:     hotel.ratings     || 3,
    })
    const [loading, setLoading] = useState(false)
    const [errMsg,  setErrMsg]  = useState("")

    const token = localStorage.getItem("token")
    const setF  = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

    const handleSave = async () => {
        if (!form.hotelName.trim()) { setErrMsg("Hotel name required."); return }
        setLoading(true); setErrMsg("")
        try {
            await axios.put(`${BASE}/api/hotel/update/${hotel.hotelId}`,
                { ...form, ratings: Number(form.ratings) },
                { headers: { Authorization: "Bearer " + token } }
            )
            onSaved("Hotel details updated.")
        } catch (e) {
            setErrMsg(e.response?.data?.message || "Failed to update hotel.")
        } finally { setLoading(false) }
    }

    return (
        <div style={s.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={s.modal}>
                <button style={s.modalClose} onClick={onClose}>✕</button>
                <div style={s.modalTitle}>Edit <span style={{ color: "#c9a84c" }}>Hotel</span></div>

                {errMsg && <div style={s.alertDanger}>{errMsg}</div>}

                <div style={s.formGroup}>
                    <label style={s.label}>Hotel Name *</label>
                    <input style={s.input} value={form.hotelName} onChange={setF("hotelName")} />
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Location</label>
                    <input style={s.input} value={form.location} onChange={setF("location")} />
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Description</label>
                    <textarea style={s.textarea} rows={3} value={form.description} onChange={setF("description")} />
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Star Rating (1–5)</label>
                    <input style={s.input} type="number" min={1} max={5}
                        value={form.ratings} onChange={setF("ratings")} />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button style={{ ...s.primaryBtn, flex: 1, padding: "12px" }}
                        onClick={handleSave} disabled={loading}>
                        {loading ? "Saving…" : "Save Changes"}
                    </button>
                    <button style={{ ...s.secondaryBtn, padding: "12px 20px" }} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default EditHotelModal