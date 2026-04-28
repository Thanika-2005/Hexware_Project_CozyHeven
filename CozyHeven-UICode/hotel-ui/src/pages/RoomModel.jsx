
const RoomModal = ({ hotelId, room, onClose, onSaved }) => {
  const isEdit = !!room
  const token  = localStorage.getItem("token")

  const [form, setForm] = useState({
    roomSize:     room?.roomSize                      || "",
    bedType:      room?.bedType                       || "KING",
    acType:       room?.acType                        || "CENTRAL",
    status:       room?.status                        || "AVAILABLE",  // ← was missing
    basePrice:    room?.basePrice != null ? String(room.basePrice) : "",
    availability: room?.availability != null ? room.availability  : 1,
    maxPeople:    room?.maxPeople   != null ? room.maxPeople       : 2,
  })

  const [loading, setLoading] = useState(false)
  const [errMsg,  setErrMsg]  = useState("")

  const change = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.roomSize.trim())                         return "Room size is required."
    if (!form.basePrice || Number(form.basePrice) <= 0) return "Valid base price required."
    if (Number(form.maxPeople) < 1)                    return "At least 1 guest required."
    if (Number(form.availability) < 0)                 return "Availability cannot be negative."
    return null
  }

  const handleSave = async () => {
    const err = validate()
    if (err) { setErrMsg(err); return }

    setLoading(true)
    setErrMsg("")

   
    const payload = {
      RoomId:       isEdit ? room.roomId : 0,
      roomSize:     form.roomSize.trim(),
      bedType:      form.bedType,       // enum string e.g. "KING"
      acType:       form.acType,        // enum string e.g. "CENTRAL"
      status:       form.status,        // enum string e.g. "AVAILABLE"
      basePrice:    Number(form.basePrice),
      availability: Number(form.availability),
      maxPeople:    Number(form.maxPeople),
    }

    try {
      if (isEdit) {
        await axios.put(
          `${BASE}/api/room/update/${room.roomId}`,
          payload,
          { headers: { Authorization: "Bearer " + token } }
        )
      } else {
        await axios.post(
          `${BASE}/api/room/add/${hotelId}`,
          payload,
          { headers: { Authorization: "Bearer " + token } }
        )
      }
      onSaved(isEdit ? "Room updated." : "Room added.")
      onClose()
    } catch (e) {
      setErrMsg(e.response?.data?.message || "Failed to save room.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">{isEdit ? "Edit" : "Add"} <span>Room</span></div>

        {errMsg && <div className="alert alert-danger">{errMsg}</div>}

        <div className="form-grid" style={{ marginBottom: 12 }}>

          {/* Bed Type */}
          <div className="form-group">
            <label className="lbl">Bed Type</label>
            <select className="input" value={form.bedType} onChange={e => change("bedType", e.target.value)}>
              <option value="KING">King</option>
              <option value="QUEEN">Queen</option>
              <option value="DOUBLE">Double</option>
              <option value="SINGLE">Single</option>
              <option value="TWIN">Twin</option>
            </select>
          </div>

          {/* Room Size */}
          <div className="form-group">
            <label className="lbl">Room Size *</label>
            <input
              className="input"
              placeholder="e.g. 300 sq ft"
              value={form.roomSize}
              onChange={e => change("roomSize", e.target.value)}
            />
          </div>

          {/* AC Type */}
          <div className="form-group">
            <label className="lbl">AC Type</label>
            <select className="input" value={form.acType} onChange={e => change("acType", e.target.value)}>
              <option value="CENTRAL">Central AC</option>
              <option value="SPLIT">Split AC</option>
              <option value="NONE">Non-AC</option>
            </select>
          </div>

          {/* Status — only shown on edit, not add (addRooms sets AVAILABLE by default) */}
          {isEdit && (
            <div className="form-group">
              <label className="lbl">Room Status</label>
              <select className="input" value={form.status} onChange={e => change("status", e.target.value)}>
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          )}

          {/* Max Guests */}
          <div className="form-group">
            <label className="lbl">Max Guests</label>
            <input
              className="input"
              type="number"
              min={1}
              max={20}
              value={form.maxPeople}
              onChange={e => change("maxPeople", e.target.value)}
            />
          </div>

          {/* Base Price */}
          <div className="form-group">
            <label className="lbl">Base Price / Night (₹) *</label>
            <input
              className="input"
              type="number"
              min={1}
              placeholder="e.g. 3500"
              value={form.basePrice}
              onChange={e => change("basePrice", e.target.value)}
            />
          </div>

          {/* Availability */}
          <div className="form-group">
            <label className="lbl">Available Units</label>
            <input
              className="input"
              type="number"
              min={0}
              value={form.availability}
              onChange={e => change("availability", e.target.value)}
            />
          </div>

        </div>

        {/* Status badge preview */}
        {isEdit && (
          <div style={{ marginBottom: 16, padding: "10px 14px", background: "var(--warm)", borderRadius: 8, fontSize: 13 }}>
            Current status:{" "}
            <span className={
              form.status === "AVAILABLE"   ? "badge badge-green" :
              form.status === "OCCUPIED"    ? "badge badge-red"   :
              "badge badge-amber"
            }>
              ● {form.status}
            </span>
            {form.status === "OCCUPIED" && (
              <span style={{ color: "var(--muted)", marginLeft: 8, fontSize: 12 }}>
                ⚠️ Changing to AVAILABLE while guests are checked in may cause conflicts.
              </span>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn-primary"
            style={{ flex: 1, padding: "12px" }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving…" : isEdit ? "Update Room" : "Add Room"}
          </button>
          <button className="btn-secondary" style={{ padding: "12px 20px" }} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}