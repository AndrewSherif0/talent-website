export default function AskTalent({ name }: { name: string }) {
  return (
    <div style={{
      backgroundColor: "rgba(139,47,201,0.08)",
      border: "1px solid rgba(139,47,201,0.2)",
      borderRadius: "12px",
      padding: "16px",
    }}>
      <h4 style={{ color: "var(--color-purple-light, #A855F7)", fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>
        🤖 اسأل {name}
      </h4>
      <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "12px" }}>
        عندك سؤال عن أسلوب العمل أو المعادلات؟
      </p>
      <button style={{
        width: "100%", padding: "10px",
        backgroundColor: "transparent",
        border: "1px solid rgba(139,47,201,0.3)",
        borderRadius: "8px",
        color: "#A855F7",
        fontSize: "13px", fontWeight: 700,
        cursor: "pointer", fontFamily: "'Cairo', sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
      }}>
        💬 أرسل سؤال
      </button>
    </div>
  );
}
