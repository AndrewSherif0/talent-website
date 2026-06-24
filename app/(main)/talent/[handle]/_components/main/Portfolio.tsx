const mockItems = [
  { type: "video", label: "Fashion Film",     duration: "0:28" },
  { type: "photo", label: "Photo Shoot",      duration: null },
  { type: "photo", label: "Commercial",       duration: null },
  { type: "video", label: "Lookbook",         duration: "0:33" },
  { type: "video", label: "Behind the Scenes",duration: "0:31" },
  { type: "photo", label: "Campaign",         duration: null },
];

const filters = ["All", "Photos", "Videos", "Runway", "Commercial", "Editorial", "Lookbooks"];

export default function Portfolio({ items }: { items?: any[] }) {
  const portfolio = items && items.length > 0 ? items : mockItems.map((m, i) => ({
    id: i, url: null, media_type: m.type, caption: m.label, duration: m.duration,
  }));
  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--bg-border)",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 700, margin: 0 }}>
            1. Portfolio
          </h3>
          <span style={{
            backgroundColor: "rgba(0,201,177,0.1)",
            color: "var(--color-teal)",
            border: "1px solid rgba(0,201,177,0.2)",
            borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 700,
          }}>
            ✓ تم التحقق من (24)
          </span>
        </div>
        <button style={{ background: "none", border: "none", color: "var(--color-teal)", fontSize: "13px", cursor: "pointer", fontFamily: "'Cairo', sans-serif" }}>
          عرض جميع الأعمال (24) ›
        </button>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "14px", overflowX: "auto" }}>
        {filters.map((f, i) => (
          <button key={f} style={{
            padding: "4px 12px",
            borderRadius: "20px",
            border: i === 0 ? "1px solid var(--color-teal)" : "1px solid var(--bg-border)",
            backgroundColor: i === 0 ? "rgba(0,201,177,0.1)" : "transparent",
            color: i === 0 ? "var(--color-teal)" : "var(--text-muted)",
            fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap",
            fontFamily: "'Cairo', sans-serif",
          }}>{f}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
        {portfolio.slice(0, 6).map((item: any, i: number) => (
          <div key={i} style={{
            aspectRatio: "4/3",
            backgroundColor: "var(--bg-elevated)",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            border: "1px solid var(--bg-border)",
          }}>
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "24px", color: "var(--text-muted)",
            }}>
              {item.media_type === "video" ? "▶" : "📷"}
            </div>
            {item.duration && (
              <span style={{
                position: "absolute", bottom: "6px", left: "6px",
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "#fff", fontSize: "11px",
                borderRadius: "4px", padding: "2px 6px",
              }}>{item.duration}</span>
            )}
            <span style={{
              position: "absolute", bottom: "6px", right: "6px",
              color: "var(--text-secondary)", fontSize: "11px",
            }}>{item.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
