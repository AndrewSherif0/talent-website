type Talent = {
  name: string;
  city: string | null;
  bio: string | null;
  category: string;
  specialties: string[];
  social_links: Record<string, string>;
};

export default function AboutSidebar({ talent }: { talent: Talent }) {
  const physicalStats = [
    { label: "الطول",        key: "height" },
    { label: "المقاس",       key: "size" },
    { label: "الوزن",        key: "weight" },
    { label: "مقاس الحذاء", key: "shoe_size" },
    { label: "لون الشعر",   key: "hair_color" },
    { label: "لون العين",   key: "eye_color" },
    { label: "اللغات",      key: "languages" },
    { label: "الفئة العمرية", key: "age_range" },
  ].map((s) => ({ ...s, value: talent.social_links?.[s.key] ?? null }))
   .filter((s) => s.value);

  return (
    <div style={{
      backgroundColor: "var(--bg-card)", border: "1px solid var(--bg-border)",
      borderRadius: "12px", padding: "16px", marginBottom: "12px",
    }}>
      <h4 style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
        About {talent.name.split(" ")[0]}
      </h4>

      {talent.bio && (
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.7, marginBottom: "12px" }}>
          {talent.bio}
        </p>
      )}

      {physicalStats.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
          {physicalStats.map((s, i) => (
            <div key={i}>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", margin: "0 0 2px" }}>{s.label}</p>
              <p style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: 600, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {talent.city && (
        <div style={{ paddingTop: physicalStats.length > 0 ? "10px" : 0, borderTop: physicalStats.length > 0 ? "1px solid var(--bg-border)" : "none" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "11px", margin: "0 0 2px" }}>الموقع</p>
          <p style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: 600, margin: 0 }}>📍 {talent.city}</p>
        </div>
      )}
    </div>
  );
}
