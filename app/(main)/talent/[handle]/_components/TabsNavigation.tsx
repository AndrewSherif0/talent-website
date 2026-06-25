"use client";
import { motion } from "framer-motion";

const BORDER = "rgba(0,255,163,0.15)", GREEN = "#00D26A", MUTED = "#A8B3C2";

const TABS = [
  { key: "about",      label: "نبذة عامة" },
  { key: "portfolio",  label: "الصور والفيديو" },
  { key: "experience", label: "الخبرات" },
  { key: "packages",   label: "الأسعار والباقات" },
  { key: "history",    label: "الأسعار السابقة" },
];

export default function TabsNavigation({ activeTab, onTabChange }: { activeTab: string; onTabChange: (t: string) => void }) {
  return (
    <div style={{ backgroundColor: "#0A121C", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "0 8px", display: "flex", alignItems: "center", gap: 2, height: 60, overflowX: "auto" }}>
      {TABS.map(tab => {
        const active = activeTab === tab.key;
        return (
          <button key={tab.key} onClick={() => onTabChange(tab.key)} style={{ position: "relative", background: "none", border: "none", color: active ? GREEN : MUTED, fontSize: 14, fontWeight: active ? 700 : 500, padding: "0 18px", height: "100%", cursor: "pointer", fontFamily: "'Cairo',sans-serif", whiteSpace: "nowrap", transition: "color 0.2s", outline: "none" }}>
            {tab.label}
            {active && (
              <motion.div layoutId="tab-bar" style={{ position: "absolute", bottom: 0, left: 6, right: 6, height: 3, backgroundColor: GREEN, borderRadius: "3px 3px 0 0" }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
