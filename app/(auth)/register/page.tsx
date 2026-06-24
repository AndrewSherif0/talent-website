"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
type TalentType = "ugc" | "influencer" | "model" | "host" | "";
type Role       = "talent" | "client";
type Step       = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface FormData {
  email: string; password: string; role: Role;
  talentType: TalentType;
  fullName: string; handle: string; city: string; gender: string;
  bio: string; category: string; specialties: string[];
  ageRange: string; height: string; weight: string;
  shoeSize: string; hairColor: string; eyeColor: string; languages: string;
  instagram: string; instagramFollowers: string;
  tiktok: string;   tiktokFollowers: string;
  youtube: string;  youtubeFollowers: string;
  linkedin: string; linkedinFollowers: string;
  avgReplyTime: string; avatarUrl: string;
}

const INIT: FormData = {
  email: "", password: "", role: "talent",
  talentType: "",
  fullName: "", handle: "", city: "", gender: "",
  bio: "", category: "", specialties: [],
  ageRange: "", height: "", weight: "", shoeSize: "",
  hairColor: "", eyeColor: "", languages: "",
  instagram: "", instagramFollowers: "",
  tiktok: "", tiktokFollowers: "",
  youtube: "", youtubeFollowers: "",
  linkedin: "", linkedinFollowers: "",
  avgReplyTime: "", avatarUrl: "",
};

const GOLD = "#FFB800";
const GOLD_BG  = "rgba(255,184,0,0.12)";
const GOLD_GLW = "rgba(255,184,0,0.35)";

const TALENT_TYPES = [
  { id: "ugc",        label: "UGC Creator",  icon: "🎬", desc: "بتعمل محتوى للبراندات" },
  { id: "influencer", label: "Influencer",   icon: "📱", desc: "عندك جمهور على السوشيال ميديا" },
  { id: "model",      label: "Model",        icon: "✨", desc: "تصوير وفاشون وإعلانات" },
  { id: "host",       label: "Host / MC",    icon: "🎙️", desc: "فعاليات وتقديم وبودكاست" },
];

const CATEGORIES = [
  "فاشون وموضة", "جمال وسكين كير", "طعام ومطبخ", "رياضة وفيتنس",
  "تكنولوجيا", "سفر وسياحة", "ترفيه وكوميديا", "لايف ستايل",
  "تعليم", "أطفال وعائلة", "ألعاب فيديو", "موسيقى وفن",
];

const SPECIALTIES_MAP: Record<string, string[]> = {
  ugc:        ["Unboxing", "Review", "Tutorial", "Story", "Reel", "Ad Creative", "Testimonial", "Demo"],
  influencer: ["Stories", "Reels", "Static Post", "TikTok Video", "YouTube Integration", "Live", "Collab"],
  model:      ["Photo Shoot", "E-commerce", "Runway", "Lookbook", "Campaign", "Editorial", "Commercial"],
  host:       ["Event Hosting", "Podcast", "Corporate MC", "Wedding", "Conference", "Virtual Event", "Live Stream"],
};

const AGE_RANGES  = ["18-22", "23-27", "28-32", "33-38", "39-45", "45+"];
const GENDERS     = [{ v: "male", l: "ذكر" }, { v: "female", l: "أنثى" }, { v: "other", l: "أخرى" }];
const HAIR_COLORS = ["أسود", "بني", "بلوند", "أحمر", "رمادي", "أشقر"];
const EYE_COLORS  = ["بني", "أخضر", "أزرق", "رمادي", "أسود", "عسلي"];
const REPLY_TIMES = ["خلال ساعة", "خلال 3 ساعات", "خلال 24 ساعة", "خلال 48 ساعة"];

const STEPS = [
  { n: 1, label: "الأكونت"  },
  { n: 2, label: "نوعك"    },
  { n: 3, label: "بياناتك" },
  { n: 4, label: "تخصصك"   },
  { n: 5, label: "مظهرك"   },
  { n: 6, label: "سوشيال"  },
  { n: 7, label: "صورتك"   },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const [step,      setStep]      = useState<Step>(1);
  const [form,      setForm]      = useState<FormData>(INIT);
  const [loading,   setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: any) => setForm(f => ({ ...f, [k]: v }));
  const toggleSpecialty = (s: string) =>
    set("specialties", form.specialties.includes(s)
      ? form.specialties.filter(x => x !== s)
      : [...form.specialties, s]);

  const canProceed = (): boolean => {
    if (step === 1) return form.email.includes("@") && form.password.length >= 8;
    if (step === 2) return form.role === "client" || !!form.talentType;
    if (step === 3) return form.fullName.trim().length > 1 && form.handle.trim().length > 2 && !!form.gender;
    if (step === 4) return !!form.category;
    return true;
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      fd.append("folder", process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER!);
      const res  = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: fd }
      );
      const data = await res.json();
      set("avatarUrl", data.secure_url);
    } catch { setError("فشل رفع الصورة، حاول مرة أخرى"); }
    setUploading(false);
  };

  const handleNext = async () => {
    if (!canProceed()) { setError("الرجاء إكمال الحقول المطلوبة *"); return; }
    setError("");
    if (step === 1) {
      setLoading(true);
      const supabase = createClient();
      const { error: err } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { role: form.role } },
      });
      setLoading(false);
      if (err) { setError(err.message); return; }
      if (form.role === "client") { await saveClientProfile(); return; }
    }
    setStep((step + 1) as Step);
  };

  const saveClientProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").upsert({
      id: user.id, role: "client",
      handle: form.email.split("@")[0].toLowerCase(),
      full_name: form.email.split("@")[0],
    });
    router.push("/home");
  };

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const social_links: Record<string, string> = {};
      if (form.height)             social_links.height              = form.height;
      if (form.weight)             social_links.weight              = form.weight;
      if (form.shoeSize)           social_links.shoe_size           = form.shoeSize;
      if (form.hairColor)          social_links.hair_color          = form.hairColor;
      if (form.eyeColor)           social_links.eye_color           = form.eyeColor;
      if (form.languages)          social_links.languages           = form.languages;
      if (form.ageRange)           social_links.age_range           = form.ageRange;
      if (form.instagram)          social_links.instagram           = form.instagram;
      if (form.instagramFollowers) social_links.instagram_followers = form.instagramFollowers;
      if (form.tiktok)             social_links.tiktok              = form.tiktok;
      if (form.tiktokFollowers)    social_links.tiktok_followers    = form.tiktokFollowers;
      if (form.youtube)            social_links.youtube             = form.youtube;
      if (form.youtubeFollowers)   social_links.youtube_followers   = form.youtubeFollowers;
      if (form.linkedin)           social_links.linkedin            = form.linkedin;
      if (form.linkedinFollowers)  social_links.linkedin_followers  = form.linkedinFollowers;
      if (form.avgReplyTime)       social_links.avg_reply_time      = form.avgReplyTime;

      await supabase.from("profiles").upsert({
        id:          user.id,
        handle:      form.handle.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        full_name:   form.fullName,
        avatar_url:  form.avatarUrl || null,
        role:        "talent",
        city:        form.city  || null,
        bio:         form.bio   || null,
        category:    form.category,
        specialties: form.specialties,
        gender:      form.gender || null,
        social_links,
      });

      await supabase.from("talent_profiles").upsert({
        user_id:       user.id,
        talent_type:   form.talentType,
        packages:      [],
        availability:  "available",
        profile_views: 0,
      });

      router.push("/home");
    } catch (e: any) {
      setError(e.message ?? "حدث خطأ، حاول مرة أخرى");
    }
    setLoading(false);
  };

  const progressPct = ((step - 1) / 6) * 100;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "32px 16px 48px",
      fontFamily: "'Cairo', sans-serif",
      direction: "rtl",
    }}>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: "640px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <Image src="/assets/logo.png" alt="Talents" width={110} height={32} style={{ objectFit: "contain" }} />
        <Link href="/login" style={{ color: "#6b7280", fontSize: "13px", textDecoration: "none" }}>
          عندك حساب؟{" "}<span style={{ color: GOLD, fontWeight: 700 }}>سجل دخول</span>
        </Link>
      </div>

      {/* Progress steps */}
      <div style={{ width: "100%", maxWidth: "640px", marginBottom: "28px" }}>
        {/* Bar + circles */}
        <div style={{ position: "relative", marginBottom: "10px" }}>
          {/* Track */}
          <div style={{ position: "absolute", top: "15px", left: 0, right: 0, height: "3px", backgroundColor: "#1e293b", borderRadius: "2px", zIndex: 0 }}>
            <div style={{
              height: "100%", borderRadius: "2px",
              backgroundColor: GOLD,
              width: `${progressPct}%`,
              transition: "width 0.4s ease",
              boxShadow: `0 0 8px ${GOLD_GLW}`,
            }} />
          </div>
          {/* Circles */}
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{
                width: "30px", height: "30px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 700, transition: "all 0.3s",
                backgroundColor: step >= s.n ? GOLD : "#1e293b",
                color:           step >= s.n ? "#000" : "#475569",
                border:          step === s.n ? `2px solid ${GOLD}` : "2px solid transparent",
                boxShadow:       step === s.n ? `0 0 10px ${GOLD_GLW}` : "none",
              }}>
                {step > s.n ? "✓" : s.n}
              </div>
            ))}
          </div>
        </div>
        {/* Labels below the bar */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {STEPS.map(s => (
            <span key={s.n} style={{
              width: "30px", textAlign: "center",
              fontSize: "10px", fontWeight: 700,
              color: step >= s.n ? GOLD : "#94a3b8",
              display: "block",
            }}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "640px",
        backgroundColor: "#111111",
        border: "1px solid #2a2a2a",
        borderRadius: "20px",
        padding: "40px",
      }}>
        {error && (
          <div style={{
            backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px", padding: "10px 14px",
            color: "#ef4444", fontSize: "13px", marginBottom: "20px",
          }}>
            {error}
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <p style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "3px", marginBottom: "6px" }}>
              الخطوة 1 من 7
            </p>
            <h2 style={{ color: "#f1f5f9", fontSize: "26px", fontWeight: 800, margin: "0 0 6px" }}>
              إنشاء حسابك 🔐
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>
              ابدأ رحلتك على منصة Talents
            </p>

            <div style={{ display: "flex", borderRadius: "10px", overflow: "hidden", border: "1px solid #2a2a2a", marginBottom: "24px" }}>
              {([["talent", "✦ موهبة / كريتور"], ["client", "🏢 براند / عميل"]] as [Role, string][]).map(([r, l]) => (
                <button key={r} onClick={() => set("role", r)} style={{
                  flex: 1, padding: "11px",
                  backgroundColor: form.role === r ? GOLD : "transparent",
                  color: form.role === r ? "#000" : "#6b7280",
                  border: "none", cursor: "pointer",
                  fontSize: "14px", fontWeight: 700,
                  fontFamily: "'Cairo', sans-serif", transition: "all 0.2s",
                }}>
                  {l}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <FInput label="البريد الإلكتروني" placeholder="example@email.com"
                type="email" value={form.email} dir="ltr"
                onChange={v => set("email", v)} />

              <div>
                <label style={labelStyle}>كلمة المرور (8 أحرف على الأقل)</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                    dir="ltr"
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                  />
                  <button onClick={() => setShowPass(!showPass)} style={{
                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "14px",
                  }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: "3px", borderRadius: "2px", transition: "background-color 0.2s",
                        backgroundColor: form.password.length >= i * 2
                          ? i <= 1 ? "#ef4444" : i === 2 ? "#f59e0b" : GOLD
                          : "#1e293b",
                      }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Talent type ── */}
        {step === 2 && (
          <div>
            <p style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "3px", marginBottom: "6px" }}>
              الخطوة 2 من 7
            </p>
            <h2 style={{ color: "#f1f5f9", fontSize: "26px", fontWeight: 800, margin: "0 0 6px" }}>
              إنت مين؟ 🎯
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>
              اختار النوع الأقرب لشغلك
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {TALENT_TYPES.map(t => (
                <button key={t.id} onClick={() => set("talentType", t.id as TalentType)} style={{
                  backgroundColor: form.talentType === t.id ? GOLD_BG : "#1a1a1a",
                  border: `2px solid ${form.talentType === t.id ? GOLD : "#2a2a2a"}`,
                  borderRadius: "14px", padding: "20px 16px",
                  cursor: "pointer", textAlign: "right", transition: "all 0.2s",
                  boxShadow: form.talentType === t.id ? `0 0 16px ${GOLD_BG}` : "none",
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{t.icon}</div>
                  <p style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: 700, margin: "0 0 4px" }}>{t.label}</p>
                  <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Basic info ── */}
        {step === 3 && (
          <div>
            <p style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "3px", marginBottom: "6px" }}>
              الخطوة 3 من 7
            </p>
            <h2 style={{ color: "#f1f5f9", fontSize: "26px", fontWeight: 800, margin: "0 0 6px" }}>
              معلوماتك الأساسية 📝
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>
              دي البيانات اللي هتتعرف بيها على المنصة
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <FInput label="الاسم الكامل *" placeholder="مثلاً: مايا خالد"
                value={form.fullName} onChange={v => set("fullName", v)} />
              <FInput label="الـ Handle (اسم المستخدم) *" placeholder="مثلاً: maya-khaled"
                value={form.handle} dir="ltr"
                onChange={v => set("handle", v.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                hint="رابطك: talents.com/maya-khaled" />
              <FInput label="المدينة" placeholder="مثلاً: القاهرة"
                value={form.city} onChange={v => set("city", v)} />
              <div>
                <label style={labelStyle}>النوع *</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {GENDERS.map(g => (
                    <button key={g.v} onClick={() => set("gender", g.v)} style={{
                      flex: 1, padding: "10px",
                      backgroundColor: form.gender === g.v ? GOLD : "#1a1a1a",
                      color: form.gender === g.v ? "#000" : "#94a3b8",
                      border: `1px solid ${form.gender === g.v ? GOLD : "#2a2a2a"}`,
                      borderRadius: "8px", cursor: "pointer",
                      fontSize: "13px", fontWeight: 700,
                      fontFamily: "'Cairo', sans-serif", transition: "all 0.2s",
                    }}>
                      {g.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Bio & Specialties ── */}
        {step === 4 && (
          <div>
            <p style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "3px", marginBottom: "6px" }}>
              الخطوة 4 من 7
            </p>
            <h2 style={{ color: "#f1f5f9", fontSize: "26px", fontWeight: 800, margin: "0 0 6px" }}>
              تخصصك وبيوك ✍️
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>
              قول للبراندات إيه اللي بتعمله
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>البيو (عن نفسك)</label>
                <textarea value={form.bio} onChange={e => set("bio", e.target.value)} rows={3}
                  placeholder="عرّف نفسك في جملتين..."
                  style={{ ...inputStyle, resize: "vertical", lineHeight: "1.7" }} />
              </div>
              <div>
                <label style={labelStyle}>الكاتيجوري الرئيسية *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CATEGORIES.map(c => (
                    <Chip key={c} label={c} active={form.category === c} onClick={() => set("category", c)} />
                  ))}
                </div>
              </div>
              {form.talentType && (
                <div>
                  <label style={labelStyle}>نوع الشغل اللي بتعمله (اختار أكتر من واحد)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {(SPECIALTIES_MAP[form.talentType] ?? []).map(s => (
                      <Chip key={s} label={s} active={form.specialties.includes(s)}
                        onClick={() => toggleSpecialty(s)} outline />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 5: Physical ── */}
        {step === 5 && (
          <div>
            <p style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "3px", marginBottom: "6px" }}>
              الخطوة 5 من 7
            </p>
            <h2 style={{ color: "#f1f5f9", fontSize: "26px", fontWeight: 800, margin: "0 0 6px" }}>
              بياناتك الشخصية 📋
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>
              بتساعد البراندات يلاقوا التالنت المناسب — كلها اختياري
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>الفئة العمرية</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {AGE_RANGES.map(a => (
                    <Chip key={a} label={a} active={form.ageRange === a} onClick={() => set("ageRange", a)} />
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <FInput label="الطول (سم)" placeholder="170" value={form.height}
                  onChange={v => set("height", v)} dir="ltr" />
                <FInput label="الوزن (كجم)" placeholder="60" value={form.weight}
                  onChange={v => set("weight", v)} dir="ltr" />
                <FInput label="مقاس الحذاء" placeholder="39" value={form.shoeSize}
                  onChange={v => set("shoeSize", v)} dir="ltr" />
                <FInput label="اللغات" placeholder="عربي، إنجليزي" value={form.languages}
                  onChange={v => set("languages", v)} />
              </div>
              <div>
                <label style={labelStyle}>لون الشعر</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {HAIR_COLORS.map(c => (
                    <Chip key={c} label={c} active={form.hairColor === c}
                      onClick={() => set("hairColor", c)} outline />
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>لون العين</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {EYE_COLORS.map(c => (
                    <Chip key={c} label={c} active={form.eyeColor === c}
                      onClick={() => set("eyeColor", c)} outline />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 6: Social ── */}
        {step === 6 && (
          <div>
            <p style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "3px", marginBottom: "6px" }}>
              الخطوة 6 من 7
            </p>
            <h2 style={{ color: "#f1f5f9", fontSize: "26px", fontWeight: 800, margin: "0 0 6px" }}>
              سوشيال ميديا 📱
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>
              حط لينكاتك وعدد الفولورز — اختياري بس بيزود فرصك
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {([
                { platform: "Instagram", icon: "📸", uk: "instagram"  as keyof FormData, fk: "instagramFollowers" as keyof FormData, ph: "instagram.com/username" },
                { platform: "TikTok",    icon: "🎵", uk: "tiktok"     as keyof FormData, fk: "tiktokFollowers"    as keyof FormData, ph: "tiktok.com/@username" },
                { platform: "YouTube",   icon: "▶️", uk: "youtube"    as keyof FormData, fk: "youtubeFollowers"   as keyof FormData, ph: "youtube.com/@channel" },
                { platform: "LinkedIn",  icon: "💼", uk: "linkedin"   as keyof FormData, fk: "linkedinFollowers"  as keyof FormData, ph: "linkedin.com/in/name" },
              ]).map(s => (
                <div key={s.platform} style={{
                  backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a",
                  borderRadius: "12px", padding: "14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{s.icon}</span>
                    <span style={{ color: "#f1f5f9", fontSize: "14px", fontWeight: 700 }}>{s.platform}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: "8px" }}>
                    <input placeholder={s.ph} value={form[s.uk] as string}
                      onChange={e => set(s.uk, e.target.value)} dir="ltr" style={inputStyle} />
                    <input placeholder="الفولورز" value={form[s.fk] as string}
                      onChange={e => set(s.fk, e.target.value)} dir="ltr" style={inputStyle} />
                  </div>
                </div>
              ))}
              <div>
                <label style={labelStyle}>وقت الرد المعتاد</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {REPLY_TIMES.map(r => (
                    <Chip key={r} label={r} active={form.avgReplyTime === r}
                      onClick={() => set("avgReplyTime", r)} outline />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 7: Photo + Summary ── */}
        {step === 7 && (
          <div>
            <p style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "3px", marginBottom: "6px" }}>
              الخطوة الأخيرة 🎉
            </p>
            <h2 style={{ color: "#f1f5f9", fontSize: "26px", fontWeight: 800, margin: "0 0 6px" }}>
              صورتك الشخصية 📸
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>
              صورة واضحة لوشك بتزود فرصك x3 عند البراندات
            </p>
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <div onClick={() => fileRef.current?.click()} style={{
                  width: "130px", height: "130px", borderRadius: "50%",
                  border: `2px dashed ${form.avatarUrl ? GOLD : "#2a2a2a"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", overflow: "hidden",
                  backgroundColor: "#1a1a1a",
                  boxShadow: form.avatarUrl ? `0 0 20px ${GOLD_BG}` : "none",
                  transition: "all 0.3s",
                }}>
                  {form.avatarUrl ? (
                    <img src={form.avatarUrl} alt="avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : uploading ? (
                    <span style={{ color: GOLD, fontSize: "12px" }}>رفع...</span>
                  ) : (
                    <div style={{ textAlign: "center", color: "#475569" }}>
                      <div style={{ fontSize: "28px" }}>📷</div>
                      <p style={{ margin: "4px 0 0", fontSize: "11px" }}>اضغط</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
                  padding: "7px 16px", backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a", borderRadius: "8px",
                  cursor: "pointer", color: "#94a3b8", fontSize: "12px",
                  fontFamily: "'Cairo', sans-serif",
                }}>
                  {uploading ? "جاري..." : form.avatarUrl ? "تغيير" : "رفع صورة"}
                </button>
              </div>

              <div style={{
                flex: 1, backgroundColor: "#1a1a1a",
                border: `1px solid ${GOLD}`,
                borderRadius: "14px", padding: "16px",
              }}>
                <p style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "2px", marginBottom: "10px" }}>
                  ملخص بياناتك
                </p>
                {[
                  { l: "النوع",      v: TALENT_TYPES.find(t => t.id === form.talentType)?.label ?? "" },
                  { l: "الاسم",      v: form.fullName },
                  { l: "الـ Handle", v: form.handle ? `@${form.handle}` : "" },
                  { l: "المدينة",    v: form.city },
                  { l: "الكاتيجوري",v: form.category },
                  { l: "Instagram",  v: form.instagram },
                  { l: "TikTok",     v: form.tiktok },
                ].filter(r => r.v).map((r, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "5px 0", borderBottom: "1px solid #2a2a2a",
                  }}>
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>{r.l}</span>
                    <span style={{ color: "#f1f5f9", fontSize: "12px", fontWeight: 600, direction: "ltr" }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Buttons ── */}
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          {step > 1 && (
            <button onClick={() => setStep((step - 1) as Step)} style={{
              flex: 1, padding: "12px",
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "10px", cursor: "pointer",
              color: "#94a3b8", fontSize: "14px", fontWeight: 600,
              fontFamily: "'Cairo', sans-serif",
            }}>
              ← رجوع
            </button>
          )}

          {step < 7 ? (
            <button onClick={handleNext} disabled={loading} style={{
              flex: 2, padding: "13px",
              backgroundColor: canProceed() ? GOLD : "#1e293b",
              border: "none", borderRadius: "10px",
              cursor: loading ? "wait" : canProceed() ? "pointer" : "not-allowed",
              color: canProceed() ? "#000" : "#475569",
              fontSize: "15px", fontWeight: 800,
              fontFamily: "'Cairo', sans-serif", transition: "all 0.2s",
              boxShadow: canProceed() ? `0 4px 15px ${GOLD_GLW}` : "none",
            }}>
              {loading ? "جاري..." : "التالي →"}
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{
              flex: 2, padding: "14px",
              backgroundColor: GOLD,
              border: "none", borderRadius: "10px",
              cursor: loading ? "wait" : "pointer",
              color: "#000", fontSize: "15px", fontWeight: 800,
              fontFamily: "'Cairo', sans-serif",
              boxShadow: `0 4px 20px ${GOLD_GLW}`,
            }}>
              {loading ? "جاري الحفظ..." : "🚀 ابدأ رحلتك على Talents"}
            </button>
          )}
        </div>

        {step >= 5 && step < 7 && (
          <button onClick={() => setStep((step + 1) as Step)} style={{
            width: "100%", marginTop: "12px", padding: "8px",
            background: "none", border: "none",
            color: "#475569", fontSize: "12px",
            cursor: "pointer", fontFamily: "'Cairo', sans-serif",
          }}>
            تخطي هذه الخطوة →
          </button>
        )}
      </div>

      <p style={{ color: "#475569", fontSize: "12px", marginTop: "16px" }}>
        خطوة {step} من 7
      </p>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  color: "#6b7280", fontSize: "13px", display: "block", marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  backgroundColor: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: "8px", color: "#f1f5f9",
  fontSize: "14px", outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Cairo', sans-serif",
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function FInput({ label, placeholder, value, onChange, hint, dir, type }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; hint?: string; dir?: string; type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type ?? "text"} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} dir={dir ?? "rtl"}
        style={inputStyle} />
      {hint && <p style={{ color: "#475569", fontSize: "11px", margin: "4px 0 0" }}>{hint}</p>}
    </div>
  );
}

function Chip({ label, active, onClick, outline }: {
  label: string; active: boolean; onClick: () => void; outline?: boolean;
}) {
  const GOLD = "#FFB800";
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px",
      backgroundColor: active
        ? outline ? "rgba(255,184,0,0.12)" : GOLD
        : "#1a1a1a",
      color: active
        ? outline ? GOLD : "#000"
        : "#94a3b8",
      border: `1px solid ${active ? GOLD : "#2a2a2a"}`,
      borderRadius: "20px", cursor: "pointer",
      fontSize: "12px", fontWeight: 600,
      fontFamily: "'Cairo', sans-serif", transition: "all 0.2s",
    }}>
      {active && outline ? "✓ " : ""}{label}
    </button>
  );
}
