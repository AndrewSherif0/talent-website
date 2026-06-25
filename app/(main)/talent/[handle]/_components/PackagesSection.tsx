"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { PackageItem } from "@/features/talent-profile/types";

const CARD = "#0D1623", BORDER = "rgba(0,255,163,0.15)", GREEN = "#00D26A", MUTED = "#A8B3C2", SURFACE = "#0A121C";

type Package = PackageItem;

const DEFAULT_PACKAGES: Package[] = [
  {
    id: "starter",
    name: "Starter",
    price: "١٥٠٠",
    popular: false,
    features: ["ساعة تصوير واحدة", "حتى ٣٠ صورة", "مراجعة واحدة", "تسليم ٣ أيام", "دعم ٤٨ ساعة"],
  },
  {
    id: "growth",
    name: "Growth",
    price: "٤٠٠٠",
    popular: true,
    features: ["٣ ساعات تصوير", "حتى ٣ ريلز", "مراجعتان", "تسليم ٥ أيام", "دعم ٧٢ ساعة"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "٧٠٠٠",
    popular: false,
    features: ["يوم تصوير كامل", "حتى ٥ ريلز", "٣ مراجعات", "تسليم ٧ أيام", "دعم أولوية"],
  },
];

interface Props {
  onSelect: (pkg: Package) => void;
  packages?: Package[] | null;
}

export default function PackagesSection({ onSelect, packages }: Props) {
  const isMobile = useIsMobile();
  const data = packages?.length ? packages : DEFAULT_PACKAGES;

  return (
    <div
      style={{
        backgroundColor: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: 800,
          marginBottom: 20,
          margin: "0 0 20px",
        }}
      >
        الباقات والأسعار
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {data.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            style={{
              backgroundColor: pkg.popular ? "rgba(0,210,106,0.06)" : SURFACE,
              border: `1px solid ${pkg.popular ? GREEN : BORDER}`,
              borderRadius: 14,
              padding: 20,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {pkg.popular && (
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: GREEN,
                  color: "#000",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "3px 12px",
                  borderRadius: 20,
                  whiteSpace: "nowrap",
                }}
              >
                الأكثر طلباً
              </div>
            )}
            <div>
              <p style={{ color: MUTED, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                {pkg.name}
              </p>
              <p
                style={{
                  color: pkg.popular ? GREEN : "#fff",
                  fontSize: 26,
                  fontWeight: 900,
                  margin: 0,
                }}
              >
                {pkg.price}{" "}
                <span style={{ fontSize: 13, fontWeight: 600, color: MUTED }}>جنيه</span>
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              {pkg.features.map((f, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={13} color={GREEN} />
                  <span style={{ color: MUTED, fontSize: 12 }}>{f}</span>
                </div>
              ))}
            </div>
            <motion.button
              onClick={() => onSelect(pkg)}
              whileHover={{ translateY: -2 }}
              style={{
                backgroundColor: pkg.popular ? GREEN : "transparent",
                color: pkg.popular ? "#000" : GREEN,
                border: `1px solid ${pkg.popular ? GREEN : "rgba(0,210,106,0.3)"}`,
                borderRadius: 10,
                padding: "10px 0",
                width: "100%",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "'Cairo',sans-serif",
                transition: "all 0.2s",
              }}
            >
              اختر الباقة
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
