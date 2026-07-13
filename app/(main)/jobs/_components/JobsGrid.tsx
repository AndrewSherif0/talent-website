"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, Banknote, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { JobPost } from "../page";

const CAT_ICONS: Record<string, string> = {
  ugc: "🎬", influencer: "📱", model: "👗", actor: "🎭", host: "🎤", photographer: "📸",
};

interface Props { dark: boolean; lang: "ar" | "en"; jobs: JobPost[] }

function JobCard({ job, dark, lang, index, myRole }: { job: JobPost; dark: boolean; lang: "ar" | "en"; index: number; myRole: string | null }) {
  const ar     = lang === "ar";
  const CARD   = dark ? "#0D1623" : "#FFFFFF";
  const BORDER = dark ? "rgba(0,255,163,0.15)" : "#E2E8F0";
  const TEXT   = dark ? "#FFFFFF" : "#0F172A";
  const MUTED  = dark ? "#A8B3C2" : "#64748B";
  const SURFACE = dark ? "#0A121C" : "#F8FAFC";
  const GREEN  = "#00D26A";
  const GOLD   = "#FFB800";

  const catIcon = job.category ? (CAT_ICONS[job.category] ?? "💼") : "💼";

  const CAT_LABELS: Record<string, { ar: string; en: string }> = {
    ugc:          { ar: "UGC محتوى", en: "UGC Creator" },
    influencer:   { ar: "مؤثر", en: "Influencer" },
    model:        { ar: "موديل", en: "Model" },
    actor:        { ar: "ممثل", en: "Actor" },
    host:         { ar: "مذيع", en: "Host" },
    photographer: { ar: "مصور", en: "Photographer" },
  };
  const catLabel = job.category ? (ar ? CAT_LABELS[job.category]?.ar : CAT_LABELS[job.category]?.en) ?? job.category : null;

  function fmtDate(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleDateString(ar ? "ar-EG" : "en-GB", { day: "numeric", month: "short" });
  }

  function fmtBudget() {
    if (!job.budget_min && !job.budget_max) return ar ? "يُتفق عليه" : "Negotiable";
    if (job.budget_min && job.budget_max && job.budget_min !== job.budget_max)
      return `${job.budget_min.toLocaleString()} – ${job.budget_max.toLocaleString()} ${job.currency}`;
    return `${(job.budget_max ?? job.budget_min)!.toLocaleString()} ${job.currency}`;
  }

  const daysAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / 86400000);
  const timeLabel = daysAgo === 0 ? (ar ? "اليوم" : "Today") : daysAgo === 1 ? (ar ? "أمس" : "Yesterday") : ar ? `منذ ${daysAgo} أيام` : `${daysAgo}d ago`;

  const router = useRouter();
  const [applied, setApplied]   = useState(false);
  const [applying, setApplying] = useState(false);
  const [toast, setToast]       = useState<string | null>(null);

  const talentRoles = ["talent", "freelancer", "ugc"];
  const canApply = myRole && talentRoles.includes(myRole);

  async function handleApply() {
    const { data: { user } } = await createClient().auth.getUser();
    if (!user) { router.push("/login"); return; }

    setApplying(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/apply`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (res.ok || data.already_applied) {
        setApplied(true);
        setToast(ar ? "تم التقديم بنجاح ✓" : "Applied successfully ✓");
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast(data.error ?? (ar ? "حدث خطأ" : "Something went wrong"));
        setTimeout(() => setToast(null), 3000);
      }
    } finally {
      setApplying(false);
    }
  }

  return (
    <motion.div
      suppressHydrationWarning
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -3, boxShadow: dark ? "0 8px 32px rgba(0,210,106,0.1)" : "0 8px 24px rgba(0,0,0,0.08)" }}
      style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden", transition: "box-shadow 0.2s" }}
    >
      {/* Top bar — brand info */}
      <div style={{ padding: "14px 16px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          backgroundColor: dark ? "#1e293b" : "#e2e8f0",
          overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 900, color: MUTED,
        }}>
          {job.brand?.avatar_url
            ? <img src={job.brand.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : (job.brand?.full_name ?? "?")[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {job.brand?.full_name ?? "—"}
          </p>
          {job.brand?.city && (
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <MapPin size={10} color={MUTED} />
              <span style={{ color: MUTED, fontSize: 10 }}>{job.brand.city}</span>
            </div>
          )}
        </div>
        <span style={{ color: MUTED, fontSize: 10, flexShrink: 0 }}>{timeLabel}</span>
      </div>

      {/* Job content */}
      <div style={{ padding: "12px 16px 16px" }}>
        {/* Category badge */}
        {catLabel && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            backgroundColor: dark ? "rgba(255,184,0,0.08)" : "rgba(255,184,0,0.06)",
            color: GOLD, border: "1px solid rgba(255,184,0,0.2)",
            borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600,
            marginBottom: 8,
          }}>
            {catIcon} {catLabel}
          </span>
        )}

        {/* Title */}
        <h3 style={{ color: TEXT, fontSize: 15, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.4 }}>
          {job.title}
        </h3>

        {/* Description */}
        {job.description && (
          <p style={{
            color: MUTED, fontSize: 12, margin: "0 0 12px", lineHeight: 1.6,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
          }}>{job.description}</p>
        )}

        {/* Stats row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          {/* Budget */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Banknote size={13} color={GREEN} />
            <span style={{ color: TEXT, fontSize: 12, fontWeight: 700 }}>{fmtBudget()}</span>
          </div>
          {/* Slots */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Users size={13} color={GREEN} />
            <span style={{ color: MUTED, fontSize: 12 }}>
              {job.slots} {ar ? (job.slots === 1 ? "مقعد" : "مقاعد") : (job.slots === 1 ? "slot" : "slots")}
            </span>
          </div>
          {/* Date range */}
          {(job.start_date || job.end_date) && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Calendar size={13} color={GOLD} />
              <span style={{ color: MUTED, fontSize: 12 }}>
                {fmtDate(job.start_date)}{job.end_date && job.start_date !== job.end_date ? ` → ${fmtDate(job.end_date)}` : ""}
              </span>
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{ marginBottom: 8, padding: "8px 12px", borderRadius: 8, backgroundColor: applied ? "rgba(0,210,106,0.12)" : "rgba(255,80,80,0.12)", border: `1px solid ${applied ? GREEN : "#f87171"}`, color: applied ? GREEN : "#f87171", fontSize: 12, fontWeight: 700, textAlign: "center" }}>
            {toast}
          </div>
        )}

        {/* CTA — Apply (talent) or disabled (brand/guest) */}
        {canApply ? (
          <button
            onClick={handleApply}
            disabled={applied || applying}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              backgroundColor: applied ? "rgba(0,210,106,0.12)" : GREEN,
              color: applied ? GREEN : "#000",
              border: applied ? `1.5px solid ${GREEN}` : "none",
              borderRadius: 10, padding: "10px 0",
              fontSize: 13, fontWeight: 900,
              cursor: applied || applying ? "default" : "pointer",
              fontFamily: "'Cairo',sans-serif", transition: "opacity 0.15s",
              opacity: applying ? 0.7 : 1,
            }}
          >
            {applying ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : applied ? <CheckCircle2 size={14} /> : null}
            {applying ? (ar ? "جارٍ التقديم..." : "Applying...") : applied ? (ar ? "تم التقديم ✓" : "Applied ✓") : (ar ? "قدّم الآن" : "Apply Now")}
          </button>
        ) : (
          <button
            disabled
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              backgroundColor: dark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
              color: MUTED, border: "none", borderRadius: 10, padding: "10px 0",
              fontSize: 13, fontWeight: 700, cursor: "not-allowed",
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            {ar ? "للمواهب فقط" : "Talents Only"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function JobsGrid({ dark, lang, jobs }: Props) {
  const ar    = lang === "ar";
  const MUTED = dark ? "#A8B3C2" : "#64748B";
  const GREEN = "#00D26A";

  const [myRole, setMyRole] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await createClient()
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      setMyRole(profile?.role ?? null);
    });
  }, []);

  if (jobs.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center", gap: 12 }}>
        <span style={{ fontSize: 48 }}>💼</span>
        <p style={{ color: MUTED, fontSize: 16, margin: 0 }}>{ar ? "لا توجد وظائف متاحة حالياً" : "No jobs available right now"}</p>
        <p style={{ color: GREEN, fontSize: 13, margin: 0 }}>{ar ? "تابعنا لاحقاً أو غيّر الفلاتر" : "Check back later or adjust filters"}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
      {jobs.map((job, i) => (
        <JobCard key={job.id} job={job} dark={dark} lang={lang} index={i} myRole={myRole} />
      ))}
    </div>
  );
}
