"use client";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { ExperienceItem } from "@/features/talent-profile/types";

const CARD = "#0D1623", BORDER = "rgba(0,255,163,0.15)", GREEN = "#00D26A", MUTED = "#A8B3C2", SURFACE = "#0A121C";

const DEFAULT_PROJECTS: ExperienceItem[] = [
  { name: "Fashion Show 2023", year: "2023", verified: true },
  { name: "Editorial 2023", year: "2023", verified: true },
  { name: "Brand Campaign 2022", year: "2022", verified: false },
  { name: "Lookbook 2022", year: "2022", verified: false },
];

interface Props {
  experience?: ExperienceItem[] | null;
}

export default function ExperienceSection({ experience }: Props) {
  const isMobile = useIsMobile();
  const projects = experience?.length ? experience : DEFAULT_PROJECTS;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 20,
      }}
    >
      {/* Left: Previous experience */}
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
            marginBottom: 16,
            margin: "0 0 16px",
          }}
        >
          الخبرات السابقة
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                backgroundColor: SURFACE,
                borderRadius: 10,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={14} color={MUTED} />
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{p.name}</span>
              </div>
              {p.verified && (
                <CheckCircle size={15} color={GREEN} fill="rgba(0,210,106,0.15)" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right: Verified on platform */}
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
            marginBottom: 16,
            margin: "0 0 16px",
          }}
        >
          موثّق على Talents
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "rgba(0,210,106,0.08)",
              border: "1px solid rgba(0,210,106,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Plus size={24} color={GREEN} />
          </div>
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 16 }}>
            لا توجد مشاريع مكتملة عبر المنصة بعد
          </p>
          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            style={{
              backgroundColor: GREEN,
              color: "#000",
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            احجز أول حملة
          </motion.button>
        </div>
      </div>
    </div>
  );
}
