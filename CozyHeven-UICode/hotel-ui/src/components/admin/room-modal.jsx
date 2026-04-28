import axios from "axios"
import { useState } from "react"
import { adminStyles as s } from "../../styles/admin-styles"

const BASE = "http://localhost:8080"

const AC_LABELS = { CENTRAL: "Central AC", SPLIT: "Split AC", NONE: "Non-AC" }
const BED_TYPES  = ["KING", "QUEEN", "DOUBLE", "SINGLE", "TWIN"]

const RoomModal = ({ hotelId, room, onClose, onSaved }) => {
    const isEdit = !!room
    const token  = localStorage.getItem("token")

    const [form, setForm] = useState({
        bedType:      room?.bedType      || "KING",
        roomSize:     room?.roomSize     || "",
        acType:       room?.acType       || "CENTRAL",
        status:       room?.status       || "AVAILABLE",
        maxPeople:    room?.maxPeople    || 2,
        basePrice:    room?.basePrice    != null ? String(room.basePrice) : "",
        availability: room?.availability ?? 1,
    })
    const [loading, setLoading] = useState(false)
    const [errMsg,  setErrMsg]  = useState("")

    const change = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const validate = () => {
        if (!form.roomSize.trim())                          return "Room size is required."
        if (!form.basePrice || Number(form.basePrice) <= 0) return "Valid base price required."
        if (Number(form.maxPeople) < 1)                     return "At least 1 guest required."
        if (Number(form.availability) < 0)                  return "Availability cannot be negative."
        return null
    }

    const handleSave = async () => {
        const err = validate()
        if (err) { setErrMsg(err); return }
        setLoading(true); setErrMsg("")

        const payload = {
            RoomId:       isEdit ? room.roomId : 0,
            roomSize:     form.roomSize.trim(),
            bedType:      form.bedType,
            acType:       form.acType,
            status:       form.status,
            basePrice:    Number(form.basePrice),
            availability: Number(form.availability),
            maxPeople:    Number(form.maxPeople),
        }

        try {
            if (isEdit) {
                await axios.put(`${BASE}/api/room/update/${room.roomId}`, payload,
                    { headers: { Authorization: "Bearer " + token } })
            } else {
                await axios.post(`${BASE}/api/room/add/${hotelId}`, payload,
                    { headers: { Authorization: "Bearer " + token } })
            }
            onSaved(isEdit ? "Room updated." : "Room added.")
            onClose()
        } catch (e) {
            setErrMsg(e.response?.data?.message || "Failed to save room.")
        } finally { setLoading(false) }
    }

    const statusPreview = {
        AVAILABLE:   { text: "✓ Guests can book this room.",       color: "#15803d" },
        OCCUPIED:    { text: "⚠️ Guests won't be able to book.",   color: "#b91c1c" },
        MAINTENANCE: { text: "🔧 Room will be hidden from booking.", color: "#a16207" },
    }

    return (
        <div style={s.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ ...s.modal, maxWidth: 520 }}>
                <button style={s.modalClose} onClick={onClose}>✕</button>
                <div style={s.modalTitle}>{isEdit ? "Edit" : "Add"} <span style={{ color: "#c9a84c" }}>Room</span></div>

                {errMsg && <div style={s.alertDanger}>{errMsg}</div>}

                <div style={s.formGrid}>
                    <div style={s.formGroup}>
                        <label style={s.label}>Bed Type</label>
                        <select style={s.input} value={form.bedType} onChange={change("bedType")}>
                            {BED_TYPES.map(b => <option key={b}>{b}</option>)}
                        </select>
                    </div>

                    <div style={s.formGroup}>
                        <label style={s.label}>Room Size *</label>
                        <input style={s.input} placeholder="e.g. 300 sq ft"
                            value={form.roomSize} onChange={change("roomSize")} />
                    </div>

                    <div style={s.formGroup}>
                        <label style={s.label}>AC Type</label>
                        <select style={s.input} value={form.acType} onChange={change("acType")}>
                            {Object.entries(AC_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>

                    <div style={s.formGroup}>
                        <label style={s.label}>Room Status</label>
                        <select style={s.input} value={form.status} onChange={change("status")}>
                            <option value="AVAILABLE">Available</option>
                            <option value="OCCUPIED">Occupied</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>
                    </div>

                    <div style={s.formGroup}>
                        <label style={s.label}>Max Guests</label>
                        <input style={s.input} type="number" min={1} max={20}
                            value={form.maxPeople} onChange={change("maxPeople")} />
                    </div>

                    <div style={s.formGroup}>
                        <label style={s.label}>Base Price / Night (₹) *</label>
                        <input style={s.input} type="number" min={1} placeholder="e.g. 3500"
                            value={form.basePrice} onChange={change("basePrice")} />
                    </div>

                    <div style={s.formGroup}>
                        <label style={s.label}>Available Units</label>
                        <input style={s.input} type="number" min={0}
                            value={form.availability} onChange={change("availability")} />
                    </div>
                </div>

                <div style={{ marginBottom: 16, padding: "10px 14px", background: "#f9f6f1", borderRadius: 8, fontSize: 13 }}>
                    <span style={{ color: "#888" }}>Status preview: </span>
                    <span style={{ fontWeight: 600, color: statusPreview[form.status]?.color }}>
                        ● {form.status}
                    </span>
                    <span style={{ color: "#888", marginLeft: 8 }}>
                        {statusPreview[form.status]?.text}
                    </span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button style={{ ...s.primaryBtn, flex: 1, padding: "12px" }}
                        onClick={handleSave} disabled={loading}>
                        {loading ? "Saving…" : isEdit ? "Update Room" : "Add Room"}
                    </button>
                    <button style={{ ...s.secondaryBtn, padding: "12px 20px" }} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default RoomModal