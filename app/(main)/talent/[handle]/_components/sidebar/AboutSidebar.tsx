export default function AboutSidebar({ talent }: { talent: any }) {
  const stats = [
    { label: "الطول",     value: "174 cm" },
    { label: "المقاس",    value: "S" },
    { label: "الوزن",     value: "57 kg" },
    { label: "مقاس الحذاء", value: "39" },
    { label: "لون الشعر", value: "Brown" },
    { label: "لون العين", value: "Brown" },
    { label: "اللغات",    value: "AR · EN" },
    { label: "الفئة العمرية", value: "20-30" },
  ];

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--bg-border)",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "12px",
    }}>
      <h4 style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
        About {talent?.name ?? "Maya"}
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {stats.map((s, i) => (
          <div key={i}>
            <p style={{ color: "var(--text-muted)", fontSize: "11px", margin: "0 0 2px" }}>{s.label}</p>
            <p style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: 600, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--bg-border)" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "11px", margin: "0 0 2px" }}>الموقع</p>
        <p style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: 600, margin: 0 }}>📍 Cairo, Egypt</p>
      </div>
    </div>
  );
}
