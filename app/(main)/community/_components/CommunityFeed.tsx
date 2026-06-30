"use client";

import { useState } from "react";

interface Props {
  dark: boolean;
  lang: "ar" | "en";
}

const TX = {
  ar: {
    all: "كل الأسئلة",
    popular: "الأكثر تفاعلاً",
    search: "ابحث عن سؤال أو تاق...",
    answers: "أجوبة",
    views: "مشاهدة",
    brand: "براند",
    talent: "موهبة",
    pinned: "مُثبت",
  },
  en: {
    all: "All Questions",
    popular: "Most Active",
    search: "Search for a question or tag...",
    answers: "Answers",
    views: "views",
    brand: "Brand",
    talent: "Talent",
    pinned: "Pinned",
  }
};

const MOCK_QUESTIONS = [
  {
    id: "1",
    title: "ما هي أفضل الطرق لتسعير جلسات تصوير الـ UGC للبراندات الناشئة؟",
    content: "بقالي فترة بشتغل كصانع محتوى وبواجه مشكلة في تحديد سعر السيشن للشركات اللي لسه بتبدأ، هل السعر يكون ثابت ولا على حسب حجم الحملة الإعلانية؟ مفضل خبرتكم..",
    user: { name: "أحمد كمال", role: "talent", is_verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" },
    tags: ["تسعير", "صناعة المحتوى", "UGC"],
    answers_count: 5,
    views: 142,
    status: "open",
    created_at: "منذ ساعتين"
  },
  {
    id: "2",
    title: "مطلوب نصيحة: براند فاشون بيبحث عن مواهب لعمل حملة صيفية بالأسكندرية",
    content: "بنرتب لحملة تصوير خارجية ومحتاجين موديلز وإنفلونسرز مقيمين في الأسكندرية أو يقدروا يتواجدوا هناك، إيه أفضل طريقة لتصفية المتقدمين عشان نضمن التزامهم بالوقت؟",
    user: { name: "براند سارة للفاشون", role: "brand", is_verified: false, avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Sara" },
    tags: ["حملة_صيفية", "تنسيق", "فاشون"],
    answers_count: 12,
    views: 310,
    status: "pinned",
    created_at: "منذ يوم"
  }
];

export default function CommunityFeed({ dark, lang }: Props) {
  const [activeTab, setActiveTab] = useState("all");
  const t = TX[lang];
  const ar = lang === "ar";
  const TEAL = "#00D26A";

  const CARD = dark ? "#0D1623" : "#FFFFFF";
  const BORDER = dark ? "rgba(0,255,163,0.1)" : "#E2E8F0";
  const TEXT = dark ? "#FFFFFF" : "#0F172A";
  const MUTED = dark ? "#94A3B8" : "#64748B";
  const TAB_BG = dark ? "#0d1527" : "#e2e8f0";
  const TAG_BG = dark ? "rgba(13,21,39,0.6)" : "rgba(241,245,249,0.8)";
  const TAG_BORDER = dark ? "rgba(30,41,59,0.6)" : "#cbd5e1";
  const INPUT_BG = dark ? "#0d1527" : "#ffffff";
  const INPUT_BORDER = dark ? "rgba(0,255,163,0.15)" : "#cbd5e1";
  const COUNTER_BG = dark ? "#111c35" : "#e2e8f0";
  const COUNTER_BORDER = dark ? "rgba(0,255,163,0.1)" : "#cbd5e1";
  const VERIFY_BORDER = dark ? CARD : "#ffffff";

  return (
    <section style={{
      maxWidth: "1152px",
      margin: "0 auto",
      padding: "48px 24px",
      direction: ar ? "rtl" : "ltr",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "40px",
      }} className="md:flex-row">
        <div style={{
          display: "flex",
          backgroundColor: TAB_BG,
          padding: "6px",
          borderRadius: "12px",
          border: `1px solid ${BORDER}`,
          width: "100%",
        }} className="md:w-auto">
          <button
            onClick={() => setActiveTab("all")}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              transition: "all 0.2s",
              cursor: "pointer",
              border: "none",
              backgroundColor: activeTab === "all" ? TEAL : "transparent",
              color: activeTab === "all" ? "#000" : MUTED,
            }}
          >
            {t.all}
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              transition: "all 0.2s",
              cursor: "pointer",
              border: "none",
              backgroundColor: activeTab === "popular" ? TEAL : "transparent",
              color: activeTab === "popular" ? "#000" : MUTED,
            }}
          >
            {t.popular}
          </button>
        </div>

        <div style={{
          position: "relative",
          width: "100%",
        }} className="md:w-80">
          <input
            type="text"
            placeholder={t.search}
            style={{
              width: "100%",
              border: `1px solid ${INPUT_BORDER}`,
              fontSize: "14px",
              borderRadius: "12px",
              padding: "12px 16px",
              outline: "none",
              backgroundColor: INPUT_BG,
              color: TEXT,
              fontFamily: "'Cairo', sans-serif",
              transition: "border-color 0.2s",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {MOCK_QUESTIONS.map((q) => (
          <article
            key={q.id}
            style={{
              backgroundColor: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "24px",
              cursor: "pointer",
              transition: "all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }} className="flex-col md:flex-row md:items-center"
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.035) translateY(-4px)";
              e.currentTarget.style.boxShadow = dark
                ? "0 20px 40px -12px rgba(0,0,0,0.45), 0 0 0 1px rgba(249,115,22,0.15)"
                : "0 12px 24px -8px rgba(0,0,0,0.1)";
              e.currentTarget.style.borderColor = "rgba(249,115,22,0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = BORDER;
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flex: 1 }}>
              <div style={{ position: "relative", flexShrink: 0, width: "48px", height: "48px" }}>
                <img src={q.user.avatar} alt={q.user.name} style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: `1px solid ${BORDER}`,
                  backgroundColor: dark ? "#0f172a" : "#e2e8f0",
                }} />
                {q.user.is_verified && (
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#00D26A",
                    borderRadius: "50%",
                    border: `2px solid ${VERIFY_BORDER}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    color: "#ffffff",
                    lineHeight: 1,
                  }}>✓</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", fontSize: "12px" }}>
                  <span style={{ fontWeight: 700, color: MUTED }}>{q.user.name}</span>
                  <span style={{
                    fontSize: "10px",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    backgroundColor: q.user.role === "brand"
                      ? "rgba(139,47,201,0.12)"
                      : "rgba(0,201,177,0.12)",
                    color: q.user.role === "brand" ? "#A855F7" : TEAL,
                    border: `1px solid ${q.user.role === "brand" ? "rgba(139,47,201,0.25)" : "rgba(0,201,177,0.25)"}`,
                  }}>
                    {q.user.role === "brand" ? t.brand : t.talent}
                  </span>
                  {q.status === "pinned" && (
                    <span style={{
                      fontSize: "10px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontWeight: 700,
                      backgroundColor: "rgba(255,184,0,0.15)",
                      color: "#FFB800",
                      border: "1px solid rgba(255,184,0,0.3)",
                    }}>
                      {t.pinned} 📌
                    </span>
                  )}
                  <span style={{ color: MUTED, opacity: 0.6 }}>{q.created_at}</span>
                </div>

                <h3 style={{
                  fontSize: ar ? "18px" : "20px",
                  fontWeight: 800,
                  color: TEXT,
                  margin: 0,
                  transition: "color 0.2s",
                  cursor: "pointer",
                  fontFamily: "'Cairo', sans-serif",
                }} className="md:text-xl">{q.title}</h3>

                <p style={{
                  fontSize: "14px",
                  color: MUTED,
                  margin: 0,
                  lineHeight: 1.7,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontFamily: "'Cairo', sans-serif",
                }}>
                  {q.content}
                </p>

                <div style={{ display: "flex", gap: "8px", paddingTop: "8px", flexWrap: "wrap" }}>
                  {q.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: "12px",
                      backgroundColor: TAG_BG,
                      color: MUTED,
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: `1px solid ${TAG_BORDER}`,
                      fontFamily: "'Cairo', sans-serif",
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              display: "flex",
              gap: "16px",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
              paddingTop: "16px",
              borderTop: `1px solid ${BORDER}`,
            }} className="md:flex-col md:gap-2 md:pt-0 md:border-t-0 w-full md:w-auto">
              <div style={{
                borderRadius: "12px",
                padding: "12px 20px",
                border: `1px solid ${COUNTER_BORDER}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COUNTER_BG,
                minWidth: "85px",
              }}>
                <span style={{ display: "block", fontSize: "20px", fontWeight: 900, color: TEAL }}>{q.answers_count}</span>
                <span style={{ fontSize: "12px", color: MUTED }}>{t.answers}</span>
              </div>
              <div style={{ fontSize: "12px", color: MUTED, opacity: 0.5, padding: "0 8px" }}>
                <span>{q.views} {t.views}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}