"use client";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const CARD = "#0D1623", BORDER = "rgba(0,255,163,0.15)", GREEN = "#00D26A", MUTED = "#A8B3C2";

export default function BriefCard() {
  return (
    <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22, textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "rgba(0,210,106,0.1)", border: "1px solid rgba(0,210,106,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        <FileText size={22} color={GREEN} />
      </div>
      <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 800, marginBottom: 6 }}>أرسل ملخص الحملة</h3>
      <p style={{ color: MUTED, fontSize: 12, marginBottom: 16 }}>شارك تفاصيل حملتك وسنتواصل معك فوراً</p>
      <motion.button whileHover={{ scale: 1.02, translateY: -2 }} style={{ backgroundColor: GREEN, color: "#000", border: "none", borderRadius: 10, padding: "11px 0", width: "100%", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Cairo',sans-serif" }}>
        إرسال Brief
      </motion.button>
    </div>
  );
}
