"use client";
import { useState } from "react";

const packages = [
  {
    key: "starter", icon: "🚀", name: "Starter",
    price: "1,500", currency: "EGP",
    desc: "لـ جلسة تصوير",
    features: ["حتى 30 صورة", "1 تعديل", "التسليم: 3 أيام", "نافذة التعديلات: 48 ساعة"],
    color: "var(--color-teal)",
  },
  {
    key: "growth", icon: "⭐", name: "Growth",
    price: "4,000", currency: "EGP",
    desc: "لـ 3 جلسات تصوير",
    features: ["حتى 1 لوك/ستايل", "2 تعديل", "التسليم: 5 أيام", "نافذة التعديلات: 72 ساعة"],
    popular: true,
    color: "var(--color-purple)",
  },
  {
    key: "premium", icon: "👑", name: "Premium",
    price: "7,000", currency: "EGP",
    desc: "لـ جلسات + جلسات فيديو",
    features: ["حتى 5 لوك/ستايل", "3 تعديل", "التسليم: 7 أيام", "أولوية في الجدولة"],
    color: "var(--color-gold)",
  },
];

export default function PackagesSection({ packages: dbPackages }: { packages?: any[] }) {
  const [selected, setSelected] = useState(0);
  const pkgList = dbPackages && dbPackages.length > 0 ? dbPackages : packages;

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--bg-border)",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "16px",
    }}>
      <h3 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
        الباقات والأسعار
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {pkgList.map((pkg: any, idx: number) => (
          <div
            key={idx}
            onClick={() => setSelected(idx)}
            style={{
              backgroundColor: selected === idx ? "rgba(0,201,177,0.05)" : "var(--bg-elevated)",
              border: `1px solid ${selected === idx ? "var(--color-teal)" : "var(--bg-border)"}`,
              borderRadius: "10px",
              padding: "16px",
              cursor: "pointer",
              position: "relative",
              transition: "all 0.2s",
            }}
          >
            {(pkg.popular || pkg.is_popular) && (
              <span style={{
                position: "absolute", top: "-10px", right: "50%", transform: "translateX(50%)",
                backgroundColor: "var(--color-orange)",
                color: "#fff", fontSize: "10px", fontWeight: 700,
                borderRadius: "4px", padding: "2px 8px", whiteSpace: "nowrap",
              }}>الأكثر طلباً</span>
            )}

            <div style={{ fontSize: "20px", marginBottom: "6px" }}>{pkg.icon ?? "📦"}</div>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 700, margin: "0 0 2px" }}>{pkg.name ?? pkg.title}</p>
            <p style={{ color: "var(--text-primary)", fontSize: "22px", fontWeight: 900, margin: "0 0 2px" }}>
              {pkg.price} <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{pkg.currency ?? "EGP"}</span>
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "12px" }}>{pkg.desc ?? pkg.description}</p>

            {(pkg.features ?? pkg.includes ?? []).map((f: string, i: number) => (
              <p key={i} style={{ color: "var(--text-secondary)", fontSize: "12px", margin: "4px 0", display: "flex", gap: "6px" }}>
                <span style={{ color: "var(--color-teal)" }}>✓</span> {f}
              </p>
            ))}

            <button style={{
              width: "100%", marginTop: "14px",
              padding: "9px",
              backgroundColor: selected === idx ? "var(--color-teal)" : "transparent",
              border: `1px solid ${selected === idx ? "var(--color-teal)" : "var(--bg-border)"}`,
              borderRadius: "8px",
              color: selected === idx ? "#000" : "var(--text-secondary)",
              fontSize: "13px", fontWeight: 700,
              cursor: "pointer", fontFamily: "'Cairo', sans-serif",
            }}>
              اختر الباقة
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
