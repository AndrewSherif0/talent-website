"use client";
import { motion } from "framer-motion";
import { MapPin, Star, Eye, Shield, Zap, Crown, Heart, Share2, MessageCircle, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { TalentData } from "@/features/talent-profile/types";

const CARD = "#0D1623", BORDER = "rgba(0,255,163,0.15)", GREEN = "#00D26A";
const GOLD = "#F4B740", TEXT = "#FFFFFF", MUTED = "#A8B3C2", SURFACE = "#0A121C";
const btn: React.CSSProperties = { cursor: "pointer", fontFamily: "'Cairo',sans-serif", border: "none", outline: "none" };

export default function ProfileHero({ talent }: { talent: TalentData }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr 360px", gap: 24 }}>

        {/* Col 1: Image */}
        <div>
          <div style={{ width: isMobile ? "100%" : 220, height: 260, borderRadius: 14, overflow: "hidden", background: "linear-gradient(160deg,#1e3a5f,#0d2137,#050B12)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", border: `1px solid ${BORDER}` }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "rgba(0,210,106,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>👩</div>
            <div style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.75)", borderRadius: 8, padding: "2px 8px" }}>
              <span style={{ color: TEXT, fontSize: 11 }}>1/12</span>
            </div>
          </div>
        </div>

        {/* Col 2: Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ color: TEXT, fontSize: 26, fontWeight: 900, margin: 0 }}>{talent.name}</h1>
            <span style={{ backgroundColor: "rgba(244,183,64,0.15)", color: GOLD, border: "1px solid rgba(244,183,64,0.3)", borderRadius: 20, padding: "3px 12px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <Crown size={12} />Gold Model
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["موديل أزياء", "تمثيل إعلاني", "مؤثرة"].map(tag => (
              <span key={tag} style={{ backgroundColor: "rgba(0,210,106,0.08)", color: GREEN, border: "1px solid rgba(0,210,106,0.2)", borderRadius: 20, padding: "3px 12px", fontSize: 12 }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: MUTED, fontSize: 13 }}>
            <MapPin size={13} color={GREEN} /><span>{talent.location}</span><span style={{ opacity: 0.4 }}>•</span><span>عضو منذ {talent.memberSince}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Star size={15} color={GOLD} fill={GOLD} />
              <span style={{ color: TEXT, fontWeight: 800 }}>{talent.rating}</span>
              <span style={{ color: MUTED, fontSize: 12 }}>({talent.reviewCount} تقييم)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: MUTED, fontSize: 12 }}>
              <Eye size={13} /><span>{talent.views} مشاهدة</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[{ icon: <Shield size={11} />, label: "موثّق" }, { icon: <Zap size={11} />, label: "رد سريع" }, { icon: <Crown size={11} />, label: "بريميوم" }].map(b => (
              <span key={b.label} style={{ display: "flex", alignItems: "center", gap: 5, backgroundColor: "rgba(0,210,106,0.08)", color: GREEN, border: "1px solid rgba(0,210,106,0.2)", borderRadius: 20, padding: "3px 12px", fontSize: 12 }}>{b.icon}{b.label}</span>
            ))}
          </div>
        </div>

        {/* Col 3: Actions + Escrow */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} style={{ ...btn, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 600 }}>
              <MessageCircle size={15} color={GREEN} />رسالة
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} style={{ ...btn, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: GREEN, color: "#000", borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 900 }}>
              <Calendar size={15} />احجز الآن
            </motion.button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <motion.button whileHover={{ scale: 1.02 }} style={{ ...btn, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: MUTED, borderRadius: 12, padding: "9px 0", fontSize: 13 }}>
              <Heart size={13} />المفضلة
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} style={{ ...btn, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: MUTED, borderRadius: 12, padding: "9px 0", fontSize: 13 }}>
              <Share2 size={13} />مشاركة
            </motion.button>
          </div>
          {/* Escrow */}
          <div style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, flex: 1 }}>
            <p style={{ color: MUTED, fontSize: 11, fontWeight: 700, marginBottom: 14, letterSpacing: 1 }}>نظام الدفع الآمن (Escrow)</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["الدفع محجوز", "تسليم العمل", "الموافقة", "الإفراج عن الأموال"].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: i === 0 ? GREEN : "rgba(0,210,106,0.1)", border: i === 0 ? "none" : "1px solid rgba(0,210,106,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === 0 ? "#000" : GREEN, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: i === 0 ? TEXT : MUTED, fontWeight: i === 0 ? 700 : 400 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
