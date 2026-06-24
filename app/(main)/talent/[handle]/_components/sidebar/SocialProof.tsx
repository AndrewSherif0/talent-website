const socials = [
  { platform: "Instagram", icon: "📸", count: "18.4K" },
  { platform: "TikTok",    icon: "🎵", count: "12.1K" },
  { platform: "YouTube",   icon: "▶️", count: "6.2K"  },
  { platform: "LinkedIn",  icon: "💼", count: "2.3K"  },
];

const metrics = [
  { label: "Avg. Reply Time", value: "⚡ 1.2h" },
  { label: "Response Rate",   value: "98%" },
  { label: "Repeat Clients",  value: "64%" },
];

export default function SocialProof({ socialLinks }: { socialLinks?: any }) {
  const links = socialLinks ?? {};
  const dynamicSocials = [
    { platform: "Instagram", icon: "📸", count: links.instagram_followers ?? links.instagram ?? "—" },
    { platform: "TikTok",    icon: "🎵", count: links.tiktok_followers    ?? links.tiktok    ?? "—" },
    { platform: "YouTube",   icon: "▶️", count: links.youtube_followers   ?? links.youtube   ?? "—" },
    { platform: "LinkedIn",  icon: "💼", count: links.linkedin_followers  ?? links.linkedin  ?? "—" },
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
        Social Proof
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {dynamicSocials.map((s, i) => (
          <div key={i} style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--bg-border)",
            borderRadius: "8px", padding: "10px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "18px", marginBottom: "4px" }}>{s.icon}</div>
            <p style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 700, margin: 0 }}>{s.count}</p>
            <p style={{ color: "var(--text-muted)", fontSize: "11px", margin: 0 }}>{s.platform}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: "12px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>Response Metrics</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{m.label}</span>
              <span style={{ color: "var(--color-teal)", fontSize: "13px", fontWeight: 700 }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
