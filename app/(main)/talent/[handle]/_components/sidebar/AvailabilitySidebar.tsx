export default function AvailabilitySidebar({ availability }: { availability?: string }) {
  const services = ["Available for Travel", "Runway", "Campaigns", "Events", "UGC / Reels"];

  return (
    <div style={{
      backgroundColor: "rgba(0,201,177,0.06)",
      border: "1px solid rgba(0,201,177,0.2)",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "12px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <h4 style={{ color: "var(--color-teal)", fontSize: "14px", fontWeight: 700, margin: 0 }}>
          ✅ متاحة الآن
        </h4>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "10px" }}>
        📅 أقرب موعد متاح: June 28, 2025
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {services.map((s, i) => (
          <p key={i} style={{ color: "var(--text-secondary)", fontSize: "12px", margin: 0, display: "flex", gap: "6px" }}>
            <span style={{ color: "var(--color-teal)" }}>✓</span> {s}
          </p>
        ))}
      </div>
    </div>
  );
}
