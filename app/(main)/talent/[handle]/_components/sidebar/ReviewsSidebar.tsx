type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: { full_name: string; avatar_url: string | null } | null;
};

export default function ReviewsSidebar({ reviews, avgRating, totalReviews }: {
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
}) {
  const stars = Math.round(avgRating);

  return (
    <div style={{
      backgroundColor: "var(--bg-card)", border: "1px solid var(--bg-border)",
      borderRadius: "12px", padding: "16px", marginBottom: "12px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h4 style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 700, margin: 0 }}>التقييمات</h4>
        {totalReviews > 0 && (
          <button style={{ background: "none", border: "none", color: "var(--color-teal)", fontSize: "12px", cursor: "pointer", fontFamily: "'Cairo', sans-serif" }}>
            عرض الكل ({totalReviews})
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <span style={{ color: "var(--color-gold)", fontSize: "36px", fontWeight: 900 }}>
          {totalReviews > 0 ? avgRating.toFixed(1) : "—"}
        </span>
        <div>
          <div style={{ color: "var(--color-gold)", fontSize: "16px" }}>
            {"★".repeat(stars)}{"☆".repeat(5 - stars)}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: 0 }}>{totalReviews} تقييم</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "12px 0" }}>
          لا توجد تقييمات بعد
        </p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} style={{
            backgroundColor: "var(--bg-elevated)", borderRadius: "8px",
            padding: "12px", marginBottom: "8px",
          }}>
            {r.comment && (
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", margin: "0 0 8px", lineHeight: 1.6 }}>
                "{r.comment}"
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                backgroundColor: "rgba(0,201,177,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", color: "var(--color-teal)", fontWeight: 700, flexShrink: 0,
              }}>
                {r.profiles?.full_name?.[0] ?? "?"}
              </div>
              <p style={{ color: "var(--text-primary)", fontSize: "12px", fontWeight: 700, margin: 0 }}>
                {r.profiles?.full_name ?? "عميل"}
              </p>
              <span style={{ color: "var(--color-gold)", fontSize: "12px", marginRight: "auto" }}>★ {r.rating}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
