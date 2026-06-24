export default function BrandsSidebar({ brands }: { brands?: any[] }) {
  const list = brands && brands.length > 0
    ? brands
    : [{ full_name: "noon" }, { full_name: "Samsung" }, { full_name: "H&M" }, { full_name: "L'Oreal" }, { full_name: "adidas" }, { full_name: "SHEIN" }];
  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--bg-border)",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "12px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h4 style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 700, margin: 0 }}>
          براندات تعاملت معها
        </h4>
        <button style={{ background: "none", border: "none", color: "var(--color-teal)", fontSize: "12px", cursor: "pointer", fontFamily: "'Cairo', sans-serif" }}>
          عرض الكل
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {list.map((b: any, i: number) => (
          <div key={i} style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--bg-border)",
            borderRadius: "8px",
            padding: "10px",
            textAlign: "center",
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--text-secondary)",
          }}>
            {b.full_name ?? b}
          </div>
        ))}
      </div>
    </div>
  );
}
