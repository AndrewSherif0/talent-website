"use client";
import { useState } from "react";

export default function TalentHeader({ talent }: { talent: any }) {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--bg-border)",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "16px",
      display: "flex",
      gap: "20px",
    }}>
      {/* Photo */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: "140px", height: "160px",
          borderRadius: "12px",
          backgroundColor: "var(--bg-elevated)",
          overflow: "hidden",
          border: "2px solid var(--bg-border)",
        }}>
          {talent.avatar_url
            ? <img src={talent.avatar_url} alt={talent.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", color: "var(--color-teal)" }}>
                {talent.name?.[0]}
              </div>
          }
        </div>
        <div style={{
          position: "absolute", bottom: "8px", right: "8px",
          backgroundColor: "rgba(0,0,0,0.7)",
          borderRadius: "6px", padding: "2px 8px",
          color: "var(--text-secondary)", fontSize: "11px",
        }}>
          1/12
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <h1 style={{ color: "var(--text-primary)", fontSize: "22px", fontWeight: 800, margin: 0 }}>
            {talent.name}
          </h1>
          <span style={{
            backgroundColor: "rgba(255,184,0,0.15)",
            color: "var(--color-gold)",
            border: "1px solid rgba(255,184,0,0.3)",
            borderRadius: "6px", padding: "2px 10px", fontSize: "12px", fontWeight: 700,
          }}>
            ⭐ Gold Model
          </span>
          <span style={{ color: "var(--color-teal)", fontSize: "16px" }}>✓</span>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "10px" }}>
          {talent.category} · {talent.specialties?.join(" · ")}
        </p>

        <div style={{ display: "flex", gap: "16px", marginBottom: "12px", color: "var(--text-muted)", fontSize: "13px" }}>
          <span>📍 {talent.city}</span>
          <span>📅 عضو منذ يناير 2024</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <span style={{ color: "var(--color-gold)", fontSize: "14px" }}>★ {talent.avg_rating ?? "4.9"}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>({talent.total_reviews ?? 86} تقييم)</span>
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>· 18K+ مشاهدة الملف</span>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {["تم التحقق", "⚡ استجابة سريعة", "محترفة"].map((b, i) => (
            <span key={i} style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--bg-border)",
              borderRadius: "6px", padding: "4px 10px",
              color: "var(--text-secondary)", fontSize: "12px",
            }}>{b}</span>
          ))}
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "10px" }}>
          ⚡ متوسط وقت الرد: خلال ساعتين
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0, width: "160px" }}>
        <button style={{
          backgroundColor: "var(--color-teal)", color: "#000",
          border: "none", borderRadius: "8px", padding: "12px",
          fontSize: "14px", fontWeight: 800, cursor: "pointer",
        }}>
          احجز الآن
        </button>
        <button style={{
          backgroundColor: "transparent",
          border: "1px solid var(--bg-border)",
          borderRadius: "8px", padding: "10px",
          color: "var(--text-primary)", fontSize: "13px",
          fontWeight: 600, cursor: "pointer",
        }}>
          💬 مراسلة
        </button>
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={() => setSaved(!saved)} style={{
            flex: 1, backgroundColor: "transparent",
            border: "1px solid var(--bg-border)",
            borderRadius: "8px", padding: "8px",
            color: saved ? "var(--color-orange)" : "var(--text-muted)",
            fontSize: "16px", cursor: "pointer",
          }}>♥</button>
          <button style={{
            flex: 1, backgroundColor: "transparent",
            border: "1px solid var(--bg-border)",
            borderRadius: "8px", padding: "8px",
            color: "var(--text-muted)", fontSize: "14px", cursor: "pointer",
          }}>↗</button>
        </div>

        {/* Escrow badge */}
        <div style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid rgba(0,201,177,0.2)",
          borderRadius: "8px", padding: "10px",
          marginTop: "4px",
        }}>
          <p style={{ color: "var(--color-teal)", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
            🛡 مدفوعات آمنة (Escrow)
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "space-between" }}>
            {["💰", "→", "📷", "→", "✓", "→", "💰"].map((s, i) => (
              <span key={i} style={{ fontSize: i % 2 === 1 ? "10px" : "14px", color: i % 2 === 1 ? "var(--text-muted)" : "var(--color-teal)" }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
