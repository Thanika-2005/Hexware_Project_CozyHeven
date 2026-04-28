import { ownerStyles as s } from "../../styles/owner-styles"
import EditHotelModal from "./edit-hotel-modal"
import AddHotelModal  from "./add-hotel-modal"
import { useState } from "react"

const OwnerHotelInfo = ({ selectedHotel, onToast, onReload }) => {
    const [editOpen, setEditOpen] = useState(false)
    const [addOpen,  setAddOpen]  = useState(false)

    if (!selectedHotel) return (
        <div style={s.emptyState}>
            <div style={s.emptyIcon}>🏨</div>
            <div style={s.emptyText}>No hotel selected</div>
            <button style={{ ...s.primaryBtn, marginTop: 16 }} onClick={() => setAddOpen(true)}>
                + Add Your First Hotel
            </button>
            {addOpen && (
                <AddHotelModal
                    onClose={() => setAddOpen(false)}
                    onSaved={msg => { onToast(msg); setAddOpen(false); onReload() }}
                />
            )}
        </div>
    )

    const rows = [
        ["Hotel Name",  selectedHotel.hotelName],
        ["Location",    selectedHotel.location    || "—"],
        ["Star Rating", selectedHotel.ratings
            ? `${"★".repeat(Math.min(selectedHotel.ratings, 5))} (${selectedHotel.ratings})`
            : "—"],
        ["Description", selectedHotel.description || "—"],
    ]

    return (
        <div>
            {editOpen && (
                <EditHotelModal
                    hotel={selectedHotel}
                    onClose={() => setEditOpen(false)}
                    onSaved={msg => { onToast(msg); setEditOpen(false); onReload() }}
                />
            )}

            {addOpen && (
                <AddHotelModal
                    onClose={() => setAddOpen(false)}
                    onSaved={msg => { onToast(msg); setAddOpen(false); onReload() }}
                />
            )}

            <div style={{ ...s.card, maxWidth: 600 }}>
                <div style={{ ...s.rowBetween, marginBottom: 20 }}>
                    <div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700 }}>
                            {selectedHotel.hotelName}
                        </div>
                        <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
                            Hotel ID: #{selectedHotel.hotelId}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 10 }}>
                        <button style={s.primaryBtn} onClick={() => setEditOpen(true)}>✏️ Edit</button>
                        <button
                            style={{
                                ...s.primaryBtn,
                                background: "#f0fdf4",
                                color: "#15803d",
                                border: "1px solid #bbf7d0",
                            }}
                            onClick={() => setAddOpen(true)}
                        >
                            + Add Hotel
                        </button>
                    </div>
                </div>

                {rows.map(([k, v]) => (
                    <div key={k} style={s.infoRow}>
                        <span style={s.infoKey}>{k}</span>
                        <span style={s.infoVal}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OwnerHotelInfo