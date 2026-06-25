"use client";
import { motion } from "framer-motion";

const CARD = "#0D1623", BORDER = "rgba(0,255,163,0.15)", MUTED = "#A8B3C2", SURFACE = "#0A121C";

const defaultBrands = ["Noon", "Samsung", "H&M", "L'Oréal", "Adidas", "Shein"];
const colors = ["#FFB800", "#1565C0", "#D32F2F", "#C62828", "#333", "#E91E63"];

import type { BrandItem } from "@/features/talent-profile/types";

export default function BrandsCard({ brands }: { brands: BrandItem[] }) {
  const list = brands?.length ? brands.map(b => b.name) : defaultBrands;
  return (
    <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22 }}>
      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 800, marginBottom: 16, margin: "0 0 16px" }}>براندات تعاونت معها</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {list.slice(0, 6).map((name, i) => (
          <motion.div key={i} whileHover={{ scale: 1.04 }}
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: colors[i] + "22", border: `1px solid ${colors[i]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: colors[i] }}>
              {name[0]}
            </div>
            <span style={{ color: MUTED, fontSize: 11, fontWeight: 600 }}>{name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
