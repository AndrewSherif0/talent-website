"use client";
import { useState } from "react";

type Package = {
  name?: string;
  title?: string;
  icon?: string;
  price?: string | number;
  currency?: string;
  desc?: string;
  description?: string;
  features?: string[];
  includes?: string[];
  is_popular?: boolean;
};

export default function PackagesSection({ packages }: { packages: Package[] }) {
  const [selected, setSelected] = useState(0);

  if (!packages || packages.length === 0) {
    return (
      <div style={{
        backgroundColor: "var(--bg-card)", border: "1px solid var(--bg-border)",
        borderRadius: "12px", padding: "40px", textAlign: "center",
        color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px",
      }}>
        لم يتم إضافة باقات بعد
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: "var(--bg-card)", border: "1px solid var(--bg-border)",
      borderRadius: "12px", padding: "20px", marginBottom: "16px",
    }}>
      <h3 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
        الباقات والأسعار
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(packages.length, 3)}, 1fr)`, gap: "12px" }}>
        {packages.map((pkg, idx) => {
          const isSelected = selected === idx;
          const name     = pkg.name ?? pkg.title ?? `باقة ${idx + 1}`;
          const desc     = pkg.desc ?? pkg.description ?? "";
          const features = pkg.features ?? pkg.includes ?? [];
          const price    = pkg.price ?? "—";
          const currency = pkg.currency ?? "EGP";

          return (
            <div key={idx} onClick={() => setSelected(idx)} style={{
              backgroundColor: isSelected ? "rgba(0,201,177,0.05)" : "var(--bg-elevated)",
              border: `1px solid ${isSelected ? "var(--color-teal)" : "var(--bg-border)"}`,
              borderRadius: "10px", padding: "16px", cursor: "pointer",
              position: "relative", transition: "all 0.2s",
            }}>
              {pkg.is_popular && (
                <span style={{
                  position: "absolute", top: "-10px", right: "50%", transform: "translateX(50%)",
                  backgroundColor: "var(--color-orange)", color: "#fff",
                  fontSize: "10px", fontWeight: 700, borderRadius: "4px", padding: "2px 8px",
                }}>الأكثر طلباً</span>
              )}

              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{pkg.icon ?? "📦"}</div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 700, margin: "0 0 2px" }}>{name}</p>
              <p style={{ color: "var(--text-primary)", fontSize: "22px", fontWeight: 900, margin: "0 0 2px" }}>
                {price} <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{currency}</span>
              </p>
              {desc && <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "12px" }}>{desc}</p>}

              {features.map((f, i) => (
                <p key={i} style={{ color: "var(--text-secondary)", fontSize: "12px", margin: "4px 0", display: "flex", gap: "6px" }}>
                  <span style={{ color: "var(--color-teal)" }}>✓</span> {f}
                </p>
              ))}

              <button style={{
                width: "100%", marginTop: "14px", padding: "9px",
                backgroundColor: isSelected ? "var(--color-teal)" : "transparent",
                border: `1px solid ${isSelected ? "var(--color-teal)" : "var(--bg-border)"}`,
                borderRadius: "8px",
                color: isSelected ? "#000" : "var(--text-secondary)",
                fontSize: "13px", fontWeight: 700,
                cursor: "pointer", fontFamily: "'Cairo', sans-serif",
              }}>
                اختر الباقة
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
