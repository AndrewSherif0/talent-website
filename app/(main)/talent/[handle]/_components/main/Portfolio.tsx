"use client";
import { useState } from "react";

type PortfolioItem = {
  id: string;
  url: string | null;
  media_type: string;
  caption: string | null;
  sort_order: number;
};

const FILTERS = ["الكل", "صور", "فيديو"];

export default function Portfolio({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState("الكل");

  const filtered = items.filter((item) => {
    if (filter === "صور")  return item.media_type === "photo";
    if (filter === "فيديو") return item.media_type === "video";
    return true;
  });

  const isEmpty = items.length === 0;

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--bg-border)",
      borderRadius: "12px", padding: "20px", marginBottom: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 700, margin: 0 }}>
            Portfolio
          </h3>
          {!isEmpty && (
            <span style={{
              backgroundColor: "rgba(0,201,177,0.1)", color: "var(--color-teal)",
              border: "1px solid rgba(0,201,177,0.2)",
              borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 700,
            }}>
              ✓ {items.length} عمل
            </span>
          )}
        </div>
        {!isEmpty && (
          <button style={{ background: "none", border: "none", color: "var(--color-teal)", fontSize: "13px", cursor: "pointer", fontFamily: "'Cairo', sans-serif" }}>
            عرض الكل ›
          </button>
        )}
      </div>

      {/* Filters */}
      {!isEmpty && (
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "4px 12px", borderRadius: "20px",
              border: `1px solid ${filter === f ? "var(--color-teal)" : "var(--bg-border)"}`,
              backgroundColor: filter === f ? "rgba(0,201,177,0.1)" : "transparent",
              color: filter === f ? "var(--color-teal)" : "var(--text-muted)",
              fontSize: "12px", cursor: "pointer", fontFamily: "'Cairo', sans-serif",
            }}>{f}</button>
          ))}
        </div>
      )}

      {/* Grid */}
      {isEmpty ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: "14px" }}>
          لم يتم رفع أعمال بعد
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {filtered.slice(0, 6).map((item) => (
            <div key={item.id} style={{
              aspectRatio: "4/3",
              backgroundColor: "var(--bg-elevated)",
              borderRadius: "8px", position: "relative",
              overflow: "hidden", cursor: "pointer",
              border: "1px solid var(--bg-border)",
            }}>
              {item.url ? (
                item.media_type === "video"
                  ? <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <img src={item.url} alt={item.caption ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "var(--text-muted)" }}>
                  {item.media_type === "video" ? "▶" : "📷"}
                </div>
              )}
              {item.media_type === "video" && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                }}>
                  <span style={{ fontSize: "28px" }}>▶</span>
                </div>
              )}
              {item.caption && (
                <span style={{
                  position: "absolute", bottom: "6px", right: "6px",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff", fontSize: "11px",
                  borderRadius: "4px", padding: "2px 6px",
                }}>{item.caption}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
