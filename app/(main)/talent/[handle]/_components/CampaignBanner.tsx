"use client";
import { motion } from "framer-motion";
import { TrendingUp, Play, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSite } from "@/contexts/SiteContext";
import type { CampaignStats, FeaturedCampaign } from "@/features/talent-profile/types";

const DEFAULT_STATS: CampaignStats = {
  views: "2.1M+",
  ctr: "4.8%",
  sales_increase: "+176%",
  repeat: "98%",
};

const DEFAULT_CAMPAIGN: FeaturedCampaign = {
  name: "Summer Collection",
  ctr_before: "1.2%",
  ctr_after: "4.8%",
  growth: "+300%",
};

interface Props {
  campaignStats?: CampaignStats | null;
  featuredCampaign?: FeaturedCampaign | null;
}

export default function CampaignBanner({ campaignStats, featuredCampaign }: Props) {
  const isMobile = useIsMobile();
  const { dark } = useSite();
  const CARD = dark ? "#0D1623" : "#FFFFFF";
  const BORDER = dark ? "rgba(0,255,163,0.15)" : "#E2E8F0";
  const GREEN = "#00D26A";
  const GOLD = "#F4B740";
  const MUTED = dark ? "#A8B3C2" : "#64748B";
  const SURFACE = dark ? "#0A121C" : "#F8FAFC";
  const stats = campaignStats ?? DEFAULT_STATS;
  const campaign = featuredCampaign ?? DEFAULT_CAMPAIGN;

  const statItems = [
    { value: stats.views, label: "مشاهدات الحملات" },
    { value: stats.ctr, label: "نسبة النقر CTR" },
    { value: stats.sales_increase, label: "زيادة المبيعات" },
    { value: stats.repeat, label: "تكرار التعاون" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "2fr 1.3fr",
        gap: 20,
        marginBottom: 24,
      }}
    >
      {/* Stats */}
      <div
        style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: 20,
          display: "flex",
          alignItems: "center",
          minHeight: 120,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            width: "100%",
          }}
        >
          {statItems.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <span style={{ color: GREEN, fontSize: 22, fontWeight: 900 }}>{s.value}</span>
              <span style={{ color: MUTED, fontSize: 11, marginTop: 4 }}>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured campaign */}
      <div
        style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: dark ? "#fff" : "#0F172A", fontSize: 14, fontWeight: 700 }}>أبرز حملة</span>
          <span
            style={{
              backgroundColor: "rgba(244,183,64,0.15)",
              color: GOLD,
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 20,
              border: "1px solid rgba(244,183,64,0.25)",
            }}
          >
            مميز
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            margin: "12px 0",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              background: "linear-gradient(135deg,#1e3a5f,#0a1520)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Play size={18} color={GREEN} />
          </div>
          <div>
            <div
              style={{
                display: "flex",
                gap: 12,
                fontSize: 12,
                marginBottom: 4,
              }}
            >
              <span style={{ color: MUTED }}>
                CTR قبل: <strong style={{ color: dark ? "#fff" : "#0F172A" }}>{campaign.ctr_before}</strong>
              </span>
              <span style={{ color: MUTED }}>
                بعد: <strong style={{ color: GREEN }}>{campaign.ctr_after}</strong>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: GREEN,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <TrendingUp size={13} />نمو {campaign.growth}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              backgroundColor: "rgba(0,210,106,0.1)",
              color: GREEN,
              border: "1px solid rgba(0,210,106,0.2)",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            <Play size={11} />مشاهدة
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              backgroundColor: SURFACE,
              color: MUTED,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            <FileText size={11} />دراسة الحالة
          </motion.button>
        </div>
      </div>
    </div>
  );
}
