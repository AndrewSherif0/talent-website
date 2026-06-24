const stats = [
  { icon: "👁", value: "2.1M+", label: "مشاهدات الحملات", change: "+38%" },
  { icon: "📈", value: "4.8%", label: "متوسط CTR",        change: "+17%" },
  { icon: "💰", value: "+176%", label: "زيادة في المبيعات", change: "+21%" },
  { icon: "🤝", value: "98%",  label: "براندات عادت للتعاون", change: "+14%" },
];

export default function PerformanceSnapshot({ talent }: { talent?: any }) {
  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--bg-border)",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "16px",
    }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* Stats grid */}
        <div style={{ flex: 1 }}>
          <p style={{ color: "var(--color-teal)", fontSize: "12px", fontWeight: 700, marginBottom: "12px" }}>
            📊 نتائج حقيقية تحققها
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--bg-border)",
                borderRadius: "10px",
                padding: "12px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
                <div style={{ color: "var(--color-teal)", fontSize: "20px", fontWeight: 900 }}>{s.value}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px", margin: "4px 0" }}>{s.label}</div>
                <div style={{ color: "#22c55e", fontSize: "11px", fontWeight: 700 }}>{s.change}</div>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "10px" }}>
            * بناءً على آخر 18 حملة مكتملة
          </p>
        </div>

        {/* Top Campaign */}
        <div style={{
          width: "260px",
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--bg-border)",
          borderRadius: "10px",
          padding: "14px",
          flexShrink: 0,
        }}>
          <p style={{ color: "var(--color-gold)", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
            🏆 Top Campaign
          </p>
          <p style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>
            Noon Summer Collection
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "10px" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "11px" }}>Before</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px", fontWeight: 700 }}>1.3%</p>
            </div>
            <div style={{ color: "var(--text-muted)" }}>→</div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "11px" }}>After</p>
              <p style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 700 }}>3.6%</p>
            </div>
            <div style={{ color: "var(--color-teal)", fontSize: "18px", fontWeight: 900, marginRight: "auto" }}>
              +176% CTR
            </div>
          </div>
          <button style={{
            width: "100%", padding: "8px",
            backgroundColor: "transparent",
            border: "1px solid var(--color-teal)",
            borderRadius: "8px",
            color: "var(--color-teal)",
            fontSize: "12px", fontWeight: 700,
            cursor: "pointer",
          }}>
            عرض دراسة الحالة كاملة
          </button>
        </div>
      </div>
    </div>
  );
}
