

const COLORS = {
    ink:    "#1a1a2e",
    gold:   "#c9a84c",
    green:  "#15803d",
    red:    "#b91c1c",
    blue:   "#1d4ed8",
    amber:  "#a16207",
    white:  "#ffffff",
    muted:  "#888888",
    border: "#e5e7eb",
    warm:   "#faf8f4",
    bgPage: "#f5f5f0",
}

export const adminStyles = {

    /* ── Layout ── */
    page:    { minHeight: "100vh", background: COLORS.bgPage, fontFamily: "'Inter',sans-serif" },
    spinner: { display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", fontSize: 14, color: COLORS.muted },
    content: { maxWidth: 1200, margin: "0 auto", padding: "28px 24px" },

    /* ── Header ── */
    header:      { background: COLORS.ink },
    headerInner: { maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    headerTitle: { fontFamily: "'Playfair Display',serif", fontSize: 22, color: COLORS.white },
    headerSub:   { fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 2 },
    homeBtn:     { background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)", color: COLORS.white, padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13 },

    /* ── Stat cards ── */
    statsGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 },
    statCard:   { background: COLORS.white, borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.07)" },
    statIcon:   { fontSize: 22, marginBottom: 6 },
    statValue:  (color) => ({ fontSize: 20, fontWeight: 700, color, fontFamily: "'Playfair Display',serif" }),
    statLabel:  { fontSize: 12, color: COLORS.muted, marginTop: 2 },

    /* ── Tabs ── */
    tabsRow: { display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${COLORS.border}` },
    tab:     (active) => ({
        padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
        background: "none",
        borderBottom: active ? `2px solid ${COLORS.gold}` : "2px solid transparent",
        color: active ? COLORS.gold : COLORS.muted, marginBottom: -1,
    }),

    /* ── Cards & layout utils ── */
    card:       { background: COLORS.white, borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.07)" },
    colList:    { display: "flex", flexDirection: "column", gap: 12 },
    rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 },

    /* ── Chips ── */
    chip: {
        display: "inline-block", padding: "3px 10px", borderRadius: 20,
        background: COLORS.warm, border: `1px solid ${COLORS.border}`,
        fontSize: 12, color: "#444", fontWeight: 500,
    },
    chipActive: {
        display: "inline-block", padding: "3px 10px", borderRadius: 20,
        background: COLORS.gold, color: COLORS.white, border: `1px solid ${COLORS.gold}`,
        fontSize: 12, fontWeight: 600,
    },

    /* ── Badges ── */
    badgeGreen: { background: "#dcfce7", color: COLORS.green, padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600 },
    badgeRed:   { background: "#fee2e2", color: COLORS.red,   padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600 },
    badgeAmber: { background: "#fef9c3", color: COLORS.amber, padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600 },
    badgeBlue:  { background: "#dbeafe", color: COLORS.blue,  padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600 },
    badgeGold:  { background: "#fef3c7", color: COLORS.gold,  padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600 },

    /* ── Buttons ── */
    primaryBtn:   { background: COLORS.ink, color: COLORS.white, border: "none", padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 },
    secondaryBtn: { background: COLORS.white, color: COLORS.ink, border: `1px solid ${COLORS.border}`, padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12 },
    dangerBtn:    { background: "#fee2e2", color: COLORS.red, border: `1px solid #fca5a5`, padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12 },

    /* ── Forms ── */
    input:    { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, outline: "none", boxSizing: "border-box" },
    textarea: { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box" },
    label:    { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 },
    formGroup: { marginBottom: 12 },
    formGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },

    /* ── Modal ── */
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modal:        { background: COLORS.white, borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", position: "relative" },
    modalClose:   { position: "absolute", top: 14, right: 18, background: "none", border: "none", fontSize: 18, cursor: "pointer", color: COLORS.muted },
    modalTitle:   { fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, marginBottom: 20 },
    alertDanger:  { background: "#fee2e2", color: COLORS.red, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 },

    /* ── Empty state ── */
    emptyState: { background: COLORS.white, borderRadius: 12, padding: "64px 24px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,.07)" },
    emptyIcon:  { fontSize: 40, marginBottom: 12 },
    emptyText:  { fontSize: 15, fontWeight: 600, color: "#333", marginBottom: 8 },

    /* ── Booking items ── */
    bookingItem:       { background: COLORS.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.07)" },
    bookingItemHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 },
    bookingItemId:     { fontWeight: 700, fontSize: 14, color: COLORS.ink },
    bookingItemBody:   { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
    bookingItemInfo:   { flex: 1, minWidth: 200 },
    bookingItemRight:  { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, minWidth: 120 },
    bookingLabel:      { fontSize: 11, color: COLORS.muted },
    bookingPrice:      { fontSize: 17, fontWeight: 700, color: COLORS.ink },
    tkey:              { fontSize: 12, color: COLORS.muted },

    /* ── Misc ── */
    priceTag:      { fontSize: 17, fontWeight: 700 },
    resultCount:   { fontSize: 13, color: COLORS.muted },
    hotelSwitcher: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" },
    overviewGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
}
