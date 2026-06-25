"use client";
import { ShieldCheck } from "lucide-react";

const CARD = "#0D1623", BORDER = "rgba(0,255,163,0.15)", GREEN = "#00D26A", MUTED = "#A8B3C2";

const features = [
  "مدفوعات آمنة 100%",
  "حماية الضمان المالي (Escrow)",
  "مراجعة يدوية لكل طلب",
  "حل سريع للنزاعات",
];

export default function TrustCard() {
  return (
    <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <ShieldCheck size={18} color={GREEN} />
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: 0 }}>الأمان والثقة</h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: "rgba(0,210,106,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ color: MUTED, fontSize: 13 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
