import axios from "axios"
import { useState } from "react"
import { ownerStyles as s } from "../../styles/owner-styles"

const BASE = "http://localhost:8080"

const StarPicker = ({ value, onChange }) => (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {[1, 2, 3, 4, 5].map(n => (
            <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                style={{
                    fontSize: 26, background: "none", border: "none", cursor: "pointer",
                    color: n <= value ? "#c9a84c" : "#ddd",
                    transition: "color .15s",
                    padding: 0,
                }}
            >★</button>
        ))}
        <span style={{ fontSize: 13, color: "#888", alignSelf: "center", marginLeft: 4 }}>
            {value} star{value !== 1 ? "s" : ""}
        </span>
    </div>
)

const EMPTY = { hotelName: "", location: "", description: "", ratings: 3 }

const AddHotelModal = ({ onClose, onSaved }) => {
    const [form,    setForm]    = useState({ ...EMPTY })
    const [loading, setLoading] = useState(false)
    const [errMsg,  setErrMsg]  = useState("")

    const token = localStorage.getItem("token")
    const setF  = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

    const validate = () => {
        if (!form.hotelName.trim()) return "Hotel name is required."
        if (!form.location.trim())  return "Location is required."
        if (form.ratings < 1 || form.ratings > 5) return "Rating must be between 1 and 5."
        return null
    }

    const handleAdd = async () => {
        const err = validate()
        if (err) { setErrMsg(err); return }

        setLoading(true)
        setErrMsg("")
        try {
            await axios.post(
                `${BASE}/api/hotel/add`,
                {
                    hotelName:   form.hotelName.trim(),
                    location:    form.location.trim(),
                    description: form.description.trim(),
                    ratings:     Number(form.ratings),
                },
                { headers: { Authorization: "Bearer " + token } }
            )
            onSaved("New hotel added successfully!")
        } catch (e) {
            setErrMsg(
                e.response?.data?.message ||
                e.response?.data?.error   ||
                "Failed to add hotel. Please try again."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={s.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={s.modal}>
                <button style={s.modalClose} onClick={onClose}>✕</button>
                <div style={s.modalTitle}>Add <span style={{ color: "#c9a84c" }}>New Hotel</span></div>

                {errMsg && <div style={s.alertDanger}>{errMsg}</div>}

                <div style={s.formGroup}>
                    <label style={s.label}>Hotel Name *</label>
                    <input
                        style={s.input}
                        placeholder="The Grand Ramesh"
                        value={form.hotelName}
                        onChange={setF("hotelName")}
                    />
                </div>

                <div style={s.formGroup}>
                    <label style={s.label}>Location *</label>
                    <input
                        style={s.input}
                        placeholder="Chennai, Tamil Nadu"
                        value={form.location}
                        onChange={setF("location")}
                    />
                </div>

                <div style={s.formGroup}>
                    <label style={s.label}>Description</label>
                    <textarea
                        style={s.textarea}
                        rows={3}
                        placeholder="Tell guests what makes this hotel special..."
                        value={form.description}
                        onChange={setF("description")}
                    />
                </div>

                <div style={s.formGroup}>
                    <label style={s.label}>Star Rating (1–5)</label>
                    <StarPicker
                        value={form.ratings}
                        onChange={v => setForm(f => ({ ...f, ratings: v }))}
                    />
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button
                        style={{ ...s.primaryBtn, flex: 1, padding: "12px" }}
                        onClick={handleAdd}
                        disabled={loading}
                    >
                        {loading ? "Adding…" : "🏨 Add Hotel"}
                    </button>
                    <button style={{ ...s.secondaryBtn, padding: "12px 20px" }} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddHotelModal