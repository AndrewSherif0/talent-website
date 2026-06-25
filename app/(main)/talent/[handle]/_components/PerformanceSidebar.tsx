"use client";
import { motion } from "framer-motion";
import type { PerformanceData } from "@/features/talent-profile/types";

const CARD = "#0D1623", BORDER = "rgba(0,255,163,0.15)", GREEN = "#00D26A", MUTED = "#A8B3C2", SURFACE = "#0A121C";

const DEFAULT: PerformanceData = {
  reach: "2.1M",
  engagement: "4.8%",
  impact: "+176%",
  repeat_clients: "98%",
};

interface Props {
  performance?: PerformanceData | null;
}

export default function PerformanceSidebar({ performance }: Props) {
  const data = performance ?? DEFAULT;

  const metrics = [
    { label: "الوصول", value: data.reach, bar: 85, color: "#00D26A" },
    { label: "نسبة التفاعل", value: data.engagement, bar: 72, color: "#F4B740" },
    { label: "تأثير الحملة", value: data.impact, bar: 90, color: "#00D26A" },
    { label: "تكرار العملاء", value: data.repeat_clients, bar: parseInt(data.repeat_clients) || 98, color: "#00D26A" },
  ];

  return (
    <div
      style={{
        backgroundColor: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: 22,
      }}
    >
      <h3
        style={{
          color: "#fff",
          fontSize: 16,
          fontWeight: 800,
          marginBottom: 18,
          margin: "0 0 18px",
        }}
      >
        ملخص الأداء
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {metrics.map((m, i) => (
          <div key={i}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ color: MUTED, fontSize: 12 }}>{m.label}</span>
              <span style={{ color: m.color, fontSize: 13, fontWeight: 800 }}>{m.value}</span>
            </div>
            <div
              style={{
                height: 6,
                backgroundColor: SURFACE,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.bar}%` }}
                transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                style={{ height: "100%", backgroundColor: m.color, borderRadius: 4 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
