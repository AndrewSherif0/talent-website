"use client";
import { useState } from "react";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "@/contexts/SiteContext";
import type { Review } from "@/features/talent-profile/types";

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 1,
    author: "أحمد الشامي",
    brand: "Noon",
    rating: 5,
    text: "تعاون رائع! Maya أبدعت في تصوير حملتنا وزادت مبيعاتنا بشكل ملحوظ.",
    date: "مارس 2024",
  },
  {
    id: 2,
    author: "سارة التميمي",
    brand: "Samsung",
    rating: 5,
    text: "احترافية عالية وإبداع لافت. نتوقع التعاون معها مجدداً في حملاتنا القادمة.",
    date: "فبراير 2024",
  },
];

interface Props {
  reviews: Review[];
  rating?: number;
}

export default function ReviewsCard({ reviews, rating = 4.9 }: Props) {
  const { dark, lang } = useSite();
  const ar = lang === "ar";
  const CARD = dark ? "#0D1623" : "#FFFFFF";
  const BORDER = dark ? "rgba(0,255,163,0.15)" : "#E2E8F0";
  const GREEN = "#00D26A";
  const GOLD = "#F4B740";
  const MUTED = dark ? "#A8B3C2" : "#64748B";
  const SURFACE = dark ? "#0A121C" : "#F8FAFC";
  const data = reviews?.length ? reviews : DEFAULT_REVIEWS;
  const [idx, setIdx] = useState(0);
  const review = data[idx];

  return (
    <div
      style={{
        backgroundColor: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h3 style={{ color: dark ? "#fff" : "#0F172A", fontSize: 16, fontWeight: 800, margin: 0 }}>{ar ? "التقييمات" : "Reviews"}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: GOLD, fontSize: 22, fontWeight: 900 }}>{rating.toFixed(1)}</span>
          <div style={{ display: "flex" }}>
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={13} color={GOLD} fill={GOLD} />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          style={{
            backgroundColor: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "rgba(0,210,106,0.15)",
                border: "1px solid rgba(0,210,106,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: GREEN,
              }}
            >
              {review.author[0]}
            </div>
            <div>
              <p style={{ color: dark ? "#fff" : "#0F172A", fontSize: 13, fontWeight: 700, margin: 0 }}>
                {review.author}
              </p>
              <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>
                {review.brand} · {review.date}
              </p>
            </div>
            <div style={{ marginRight: "auto", display: "flex" }}>
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  size={11}
                  color={s <= review.rating ? GOLD : MUTED}
                  fill={s <= review.rating ? GOLD : "transparent"}
                />
              ))}
            </div>
          </div>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            &quot;{review.text}&quot;
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Carousel nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginTop: 14,
        }}
      >
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          style={{
            background: "none",
            border: "none",
            color: idx === 0 ? MUTED : GREEN,
            cursor: idx === 0 ? "default" : "pointer",
            opacity: idx === 0 ? 0.4 : 1,
          }}
        >
          <ChevronRight size={18} />
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === idx ? GREEN : "rgba(168,179,194,0.3)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setIdx(i => Math.min(data.length - 1, i + 1))}
          disabled={idx === data.length - 1}
          style={{
            background: "none",
            border: "none",
            color: idx === data.length - 1 ? MUTED : GREEN,
            cursor: idx === data.length - 1 ? "default" : "pointer",
            opacity: idx === data.length - 1 ? 0.4 : 1,
          }}
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  );
}
