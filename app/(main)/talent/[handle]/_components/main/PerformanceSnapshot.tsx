type Props = {
  profileViews:   number;
  avgRating:      number;
  totalBookings:  number;
  totalReviews:   number;
  topBooking?:    any;
};

export default function PerformanceSnapshot({
  profileViews, avgRating, totalBookings, totalReviews, topBooking,
}: Props) {
  const stats = [
    { icon: "👁",  value: profileViews >= 1000 ? `${(profileViews / 1000).toFixed(1)}K+` : String(profileViews), label: "مشاهدات الملف" },
    { icon: "⭐",  value: avgRating ? avgRating.toFixed(1) : "—", label: "متوسط التقييم" },
    { icon: "📦",  value: String(totalBookings), label: "حملة مكتملة" },
    { icon: "💬",  value: String(totalReviews),  label: "تقييم" },
  ];

  const brandName = topBooking?.client_profiles?.profiles?.full_name ?? null;

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--bg-border)",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "16px",
    }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>

        {/* Stats */}
        <div style={{ flex: 1 }}>
          <p style={{ color: "var(--color-teal)", fontSize: "12px", fontWeight: 700, marginBottom: "12px" }}>
            📊 نتائج حقيقية تحققها
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--bg-border)",
                borderRadius: "10px", padding: "12px", textAlign: "center",
              }}>
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
                <div style={{ color: "var(--color-teal)", fontSize: "20px", fontWeight: 900 }}>{s.value}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "10px" }}>
            * بناءً على آخر {totalBookings} حملة مكتملة
          </p>
        </div>

        {/* Top Campaign */}
        {topBooking ? (
          <div style={{
            width: "240px", flexShrink: 0,
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--bg-border)",
            borderRadius: "10px", padding: "14px",
          }}>
            <p style={{ color: "var(--color-gold)", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
              🏆 Top Campaign
            </p>
            <p style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>
              {brandName ?? topBooking.job_type ?? "حملة مكتملة"}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "10px" }}>
              💰 {topBooking.fee ? `${Number(topBooking.fee).toLocaleString()} EGP` : "—"}
            </p>
            <div style={{
              backgroundColor: "rgba(0,201,177,0.08)",
              borderRadius: "6px", padding: "8px",
              color: "var(--color-teal)", fontSize: "12px", fontWeight: 700, textAlign: "center",
            }}>
              ✓ مكتملة عبر Talents
            </div>
          </div>
        ) : (
          <div style={{
            width: "240px", flexShrink: 0,
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--bg-border)",
            borderRadius: "10px", padding: "14px",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "8px",
          }}>
            <p style={{ color: "var(--color-gold)", fontSize: "11px", fontWeight: 700 }}>🏆 Top Campaign</p>
            <p style={{ color: "var(--text-muted)", fontSize: "12px", textAlign: "center" }}>
              لا توجد حملات مكتملة بعد
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
