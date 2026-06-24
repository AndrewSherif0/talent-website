type Brand = { full_name: string; avatar_url: string | null };

export default function BrandsSidebar({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <div style={{
      backgroundColor: "var(--bg-card)", border: "1px solid var(--bg-border)",
      borderRadius: "12px", padding: "16px", marginBottom: "12px",
    }}>
      <h4 style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
        براندات تعاملت معها
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {brands.map((b, i) => (
          <div key={i} style={{
            backgroundColor: "var(--bg-elevated)", border: "1px solid var(--bg-border)",
            borderRadius: "8px", padding: "10px", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          }}>
            {b.avatar_url ? (
              <img src={b.avatar_url} alt={b.full_name}
                style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                backgroundColor: "rgba(0,201,177,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700, color: "var(--color-teal)",
              }}>
                {b.full_name[0]}
              </div>
            )}
            <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}>
              {b.full_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
