"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Lang = "ar" | "en";
type Mode = "dark" | "light";

const GOLD     = "#FFB800";
const GOLD_BG  = "rgba(255,184,0,0.12)";
const GOLD_GLW = "rgba(255,184,0,0.35)";

const TX = {
  ar: {
    loading: "جاري تحميل بروفايلك...",
    noProfile: "لا يوجد بروفايل",
    editProfile: "تعديل البروفايل",
    saveChanges: "حفظ التغييرات",
    saving: "جاري الحفظ...",
    cancel: "إلغاء",
    fullName: "الاسم الكامل",
    handle: "اسم المستخدم (Handle)",
    city: "المدينة",
    bio: "البيو",
    bioPlaceholder: "اكتب نبذة عنك...",
    changePhoto: "تغيير الصورة",
    uploading: "جاري الرفع...",
    role: "نوع الحساب",
    talent: "موهبة / كريتور",
    client: "عميل / براند",
    member: "عضو منذ",
    profileViews: "مشاهدات",
    avgRating: "التقييم",
    bookings: "حملات",
    specialties: "التخصصات",
    availability: "الحالة",
    available: "متاح",
    unavailable: "غير متاح",
    saved: "تم الحفظ ✓",
    socialLinks: "السوشيال ميديا",
    physicalInfo: "البيانات الشخصية",
    accountInfo: "بيانات الحساب",
    height: "الطول (سم)",
    weight: "الوزن (كجم)",
    hairColor: "لون الشعر",
    eyeColor: "لون العين",
    languages: "اللغات",
    ageRange: "الفئة العمرية",
    portfolio: "البورتفوليو",
    addPhoto: "📷 أضف صورة",
    addVideo: "🎬 أضف فيديو",
    uploadingMedia: "جاري الرفع...",
    captionPlaceholder: "تعليق (اختياري)...",
    noMedia: "لا يوجد محتوى بعد — ابدأ بإضافة صور أو فيديوهات",
    deleteConfirm: "حذف",
    photos: "صور",
    videos: "فيديو",
    all: "الكل",
  },
  en: {
    loading: "Loading your profile...",
    noProfile: "No profile found",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    saving: "Saving...",
    cancel: "Cancel",
    fullName: "Full Name",
    handle: "Username (Handle)",
    city: "City",
    bio: "Bio",
    bioPlaceholder: "Write something about yourself...",
    changePhoto: "Change Photo",
    uploading: "Uploading...",
    role: "Account Type",
    talent: "Talent / Creator",
    client: "Client / Brand",
    member: "Member since",
    profileViews: "Views",
    avgRating: "Rating",
    bookings: "Campaigns",
    specialties: "Specialties",
    availability: "Status",
    available: "Available",
    unavailable: "Unavailable",
    saved: "Saved ✓",
    socialLinks: "Social Media",
    physicalInfo: "Personal Info",
    accountInfo: "Account Info",
    height: "Height (cm)",
    weight: "Weight (kg)",
    hairColor: "Hair Color",
    eyeColor: "Eye Color",
    languages: "Languages",
    ageRange: "Age Range",
    portfolio: "Portfolio",
    addPhoto: "📷 Add Photo",
    addVideo: "🎬 Add Video",
    uploadingMedia: "Uploading...",
    captionPlaceholder: "Caption (optional)...",
    noMedia: "No media yet — start by adding photos or videos",
    deleteConfirm: "Delete",
    photos: "Photos",
    videos: "Videos",
    all: "All",
  },
};

type MediaItem = { id: string; url: string; media_type: "photo" | "video"; caption: string | null };

export default function MyProfilePage() {
  const router   = useRouter();
  const fileRef  = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const [lang, setLang] = useState<Lang>("ar");
  const [mode, setMode] = useState<Mode>("dark");
  const [edit, setEdit] = useState(false);

  const [profile,   setProfile]   = useState<any>(null);
  const [tp,        setTp]        = useState<any>(null);
  const [media,     setMedia]     = useState<MediaItem[]>([]);
  const [filter,    setFilter]    = useState<"all"|"photo"|"video">("all");
  const [status,    setStatus]    = useState<"loading"|"ready"|"none">("loading");
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [saveMsg,   setSaveMsg]   = useState("");
  const [uploadErr, setUploadErr] = useState("");
  const [caption,   setCaption]   = useState("");
  const [form,      setForm]      = useState<any>({});

  const dark = mode === "dark";
  const dir  = lang === "ar" ? "rtl" : "ltr";
  const tx   = TX[lang];

  const BG     = dark ? "#030812" : "#f5f5f0";
  const CARD   = dark ? "#0d1527" : "#ffffff";
  const BORDER = dark ? "#1e293b" : "#e2e8f0";
  const ELV    = dark ? "#111c35" : "#f1f5f9";
  const TEXT   = dark ? "#f1f5f9" : "#0f172a";
  const SUB    = dark ? "#94a3b8" : "#475569";
  const MUTED  = dark ? "#475569" : "#94a3b8";
  const INP    = dark ? "#1a1a2e" : "#f8fafc";

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/me");
      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) { setStatus("none"); return; }
      const { profile: prof, talentProfile: talentProf, portfolioItems } = await res.json();
      setProfile(prof);
      setTp(talentProf ?? null);
      setMedia(portfolioItems ?? []);
      const sl = (talentProf?.social_links ?? {}) as Record<string, string>;
      setForm({
        full_name:    prof.full_name    ?? "",
        handle:       prof.handle       ?? "",
        city:         prof.city         ?? "",
        bio:          prof.bio ?? talentProf?.bio ?? "",
        avatar_url:   prof.avatar_url   ?? "",
        instagram:    sl.instagram      ?? "",
        tiktok:       sl.tiktok         ?? "",
        youtube:      sl.youtube        ?? "",
        linkedin:     sl.linkedin       ?? "",
        height:       sl.height         ?? "",
        weight:       sl.weight         ?? "",
        hair_color:   sl.hair_color     ?? "",
        eye_color:    sl.eye_color      ?? "",
        languages:    sl.languages      ?? "",
        age_range:    sl.age_range      ?? "",
        availability: talentProf?.availability ?? "available",
      });
      setStatus("ready");
    })();
  }, []);

  // ── Avatar upload ──────────────────────────────────────────────────────────
  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    setUploadErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      fd.append("folder", process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ?? "talents");
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.secure_url) {
        setForm((f: any) => ({ ...f, avatar_url: data.secure_url }));
      } else {
        setUploadErr(data.error?.message ?? "فشل الرفع — تحقق من إعدادات Cloudinary");
      }
    } catch (e: any) {
      setUploadErr(e.message ?? "خطأ في الاتصال");
    }
    setUploading(false);
  };

  // ── Portfolio media upload ─────────────────────────────────────────────────
  const handleMediaUpload = async (file: File, type: "photo" | "video") => {
    setMediaUploading(true);
    setUploadErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      fd.append("folder", (process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ?? "talents") + "/portfolio");

      const endpoint = type === "video"
        ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
        : `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

      const res  = await fetch(endpoint, { method: "POST", body: fd });
      const data = await res.json();
      if (!data.secure_url) {
        setUploadErr(data.error?.message ?? "فشل الرفع — تحقق من إعدادات Cloudinary");
        setMediaUploading(false);
        return;
      }

      const saveRes = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.secure_url, media_type: type, caption: caption || null }),
      });
      const saved = await saveRes.json();
      if (saved.item) {
        setMedia(prev => [saved.item, ...prev]);
        setCaption("");
      }
    } catch (e: any) {
      setUploadErr(e.message ?? "خطأ في الاتصال");
    }
    setMediaUploading(false);
  };

  const handleDeleteMedia = async (id: string) => {
    await fetch("/api/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  // ── Save profile ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { setSaving(false); return; }

    const social_links = {
      ...(tp?.social_links ?? {}),
      instagram:  form.instagram,
      tiktok:     form.tiktok,
      youtube:    form.youtube,
      linkedin:   form.linkedin,
      height:     form.height,
      weight:     form.weight,
      hair_color: form.hair_color,
      eye_color:  form.eye_color,
      languages:  form.languages,
      age_range:  form.age_range,
    };

    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        role:   profile.role ?? "talent",
        profileData: { full_name: form.full_name, handle: form.handle, city: form.city, bio: form.bio, avatar_url: form.avatar_url || null },
        ...(tp ? { talentProfileData: { category: tp.category, specialties: tp.specialties ?? [], social_links, bio: form.bio, availability: form.availability, packages: tp.packages ?? [], profile_views: tp.profile_views ?? 0 } } : {}),
      }),
    });

    setProfile((p: any) => ({ ...p, full_name: form.full_name, handle: form.handle, city: form.city, bio: form.bio, avatar_url: form.avatar_url }));
    if (tp) setTp((t: any) => ({ ...t, social_links, availability: form.availability }));
    setSaving(false);
    setSaveMsg(tx.saved);
    setTimeout(() => { setSaveMsg(""); setEdit(false); }, 1500);
  };

  const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", backgroundColor: INP, border: `1px solid ${BORDER}`, borderRadius: "8px", color: TEXT, fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'Cairo', sans-serif" };
  const lbl: React.CSSProperties = { color: MUTED, fontSize: "12px", display: "block", marginBottom: "6px" };
  const setF = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  const filteredMedia = filter === "all" ? media : media.filter(m => m.media_type === filter);

  // ── Loading / error states ────────────────────────────────────────────────
  if (status === "loading") return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: `3px solid #1e293b`, borderTopColor: GOLD, animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "#475569", fontSize: "14px" }}>{tx.loading}</p>
      </div>
    </div>
  );

  if (status === "none") return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#475569", fontFamily: "'Cairo', sans-serif" }}>{tx.noProfile}</p>
    </div>
  );

  const sl = tp?.social_links ?? {};
  const createdAt = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, fontFamily: "'Cairo', sans-serif", direction: dir, transition: "background 0.3s" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 16px" }}>

        {/* ── Top bar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ color: TEXT, fontSize: "20px", fontWeight: 800, margin: 0 }}>
            {edit ? tx.editProfile : (lang === "ar" ? "بروفايلي" : "My Profile")}
          </h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={() => setLang(l => l === "ar" ? "en" : "ar")} style={{ background: ELV, border: `1px solid ${BORDER}`, borderRadius: "6px", padding: "4px 10px", cursor: "pointer", color: MUTED, fontSize: "12px", fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
              {lang === "ar" ? "EN" : "ع"}
            </button>
            <button onClick={() => setMode(m => m === "dark" ? "light" : "dark")} style={{ background: ELV, border: `1px solid ${BORDER}`, borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "13px" }}>
              {dark ? "☀️" : "🌙"}
            </button>
            {!edit && (
              <button onClick={() => setEdit(true)} style={{ backgroundColor: GOLD, color: "#000", border: "none", borderRadius: "8px", padding: "8px 18px", cursor: "pointer", fontSize: "13px", fontWeight: 700, fontFamily: "'Cairo', sans-serif" }}>
                ✏️ {tx.editProfile}
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════ VIEW MODE ══════════════════ */}
        {!edit && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "20px", alignItems: "start", marginBottom: "24px" }}>

              {/* Left — avatar card */}
              <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                <div style={{ width: "110px", height: "110px", borderRadius: "50%", border: `3px solid ${GOLD}`, margin: "0 auto 14px", overflow: "hidden", backgroundColor: ELV, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${GOLD_GLW}` }}>
                  {profile.avatar_url
                    ? <img src={profile.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ color: GOLD, fontSize: "36px", fontWeight: 800 }}>{profile.full_name?.[0] ?? "?"}</span>}
                </div>
                <h2 style={{ color: TEXT, fontSize: "18px", fontWeight: 800, margin: "0 0 4px" }}>{profile.full_name}</h2>
                {profile.handle && <p style={{ color: GOLD, fontSize: "13px", margin: "0 0 6px" }}>@{profile.handle}</p>}
                {profile.city   && <p style={{ color: MUTED, fontSize: "13px", margin: "0 0 12px" }}>📍 {profile.city}</p>}
                <span style={{ backgroundColor: GOLD_BG, color: GOLD, border: `1px solid ${GOLD}44`, borderRadius: "6px", padding: "3px 12px", fontSize: "12px", fontWeight: 700 }}>
                  {profile.role === "talent" ? tx.talent : tx.client}
                </span>
                {createdAt && <p style={{ color: MUTED, fontSize: "11px", marginTop: "12px" }}>📅 {tx.member} {createdAt}</p>}
                {tp && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "16px", borderTop: `1px solid ${BORDER}`, paddingTop: "16px" }}>
                    {[
                      { label: tx.profileViews, val: tp.profile_views ?? 0 },
                      { label: tx.avgRating,    val: tp.avg_rating ? Number(tp.avg_rating).toFixed(1) : "—" },
                      { label: tx.bookings,     val: tp.total_bookings ?? 0 },
                      { label: lang === "ar" ? "تقييمات" : "Reviews", val: tp.total_reviews ?? 0 },
                    ].map((s, i) => (
                      <div key={i} style={{ backgroundColor: ELV, borderRadius: "8px", padding: "10px 6px", textAlign: "center" }}>
                        <p style={{ color: GOLD, fontSize: "18px", fontWeight: 900, margin: 0 }}>{String(s.val)}</p>
                        <p style={{ color: MUTED, fontSize: "10px", margin: 0 }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {(profile.bio || tp?.bio) && (
                  <Section title={lang === "ar" ? "البيو" : "Bio"} CARD={CARD} BORDER={BORDER} TEXT={TEXT} GOLD={GOLD}>
                    <p style={{ color: SUB, fontSize: "14px", lineHeight: 1.8, margin: 0 }}>{profile.bio ?? tp?.bio}</p>
                  </Section>
                )}
                {tp && (
                  <Section title={lang === "ar" ? "معلومات التالنت" : "Talent Info"} CARD={CARD} BORDER={BORDER} TEXT={TEXT} GOLD={GOLD}>
                    <Row label={lang === "ar" ? "الكاتيجوري" : "Category"} val={tp.category} MUTED={MUTED} TEXT={TEXT} BORDER={BORDER} />
                    <Row label={tx.availability} val={tp.availability === "available" ? tx.available : tx.unavailable} MUTED={MUTED} TEXT={TEXT} BORDER={BORDER} />
                    {tp.specialties?.length > 0 && (
                      <div style={{ paddingTop: "10px" }}>
                        <p style={{ color: MUTED, fontSize: "12px", marginBottom: "8px" }}>{tx.specialties}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {tp.specialties.map((s: string, i: number) => (
                            <span key={i} style={{ backgroundColor: GOLD_BG, color: GOLD, border: `1px solid ${GOLD}33`, borderRadius: "16px", padding: "3px 10px", fontSize: "12px", fontWeight: 600 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Section>
                )}
                {tp && Object.keys(sl).some(k => ["height","weight","hair_color","eye_color","languages","age_range"].includes(k) && sl[k]) && (
                  <Section title={tx.physicalInfo} CARD={CARD} BORDER={BORDER} TEXT={TEXT} GOLD={GOLD}>
                    {[["height",tx.height],["weight",tx.weight],["hair_color",tx.hairColor],["eye_color",tx.eyeColor],["languages",tx.languages],["age_range",tx.ageRange]].filter(([k]) => sl[k]).map(([k,l], i) => (
                      <Row key={i} label={l} val={sl[k]} MUTED={MUTED} TEXT={TEXT} BORDER={BORDER} />
                    ))}
                  </Section>
                )}
                {tp && ["instagram","tiktok","youtube","linkedin"].some(k => sl[k]) && (
                  <Section title={tx.socialLinks} CARD={CARD} BORDER={BORDER} TEXT={TEXT} GOLD={GOLD}>
                    {[["instagram","📸"],["tiktok","🎵"],["youtube","▶️"],["linkedin","💼"]].filter(([k]) => sl[k]).map(([k,icon], i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                        <span style={{ fontSize: "16px" }}>{icon}</span>
                        <span style={{ color: SUB, fontSize: "13px", textTransform: "capitalize" }}>{k}</span>
                        <span style={{ color: GOLD, fontSize: "13px", fontWeight: 700, marginRight: "auto", direction: "ltr" }}>{sl[k]}</span>
                      </div>
                    ))}
                  </Section>
                )}
              </div>
            </div>

            {/* ══ PORTFOLIO SECTION ══ */}
            <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "24px" }}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h2 style={{ color: TEXT, fontSize: "17px", fontWeight: 800, margin: 0 }}>
                    {tx.portfolio}
                  </h2>
                  {media.length > 0 && (
                    <span style={{ backgroundColor: GOLD_BG, color: GOLD, border: `1px solid ${GOLD}33`, borderRadius: "6px", padding: "2px 8px", fontSize: "12px", fontWeight: 700 }}>
                      {media.length}
                    </span>
                  )}
                </div>

                {/* Upload buttons */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {/* Caption input */}
                  <input
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder={tx.captionPlaceholder}
                    style={{ padding: "7px 12px", backgroundColor: ELV, border: `1px solid ${BORDER}`, borderRadius: "7px", color: TEXT, fontSize: "12px", outline: "none", width: "170px", fontFamily: "'Cairo', sans-serif" }}
                  />
                  {/* Photo upload */}
                  <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) { handleMediaUpload(f, "photo"); e.target.value = ""; } }} />
                  <button
                    onClick={() => photoRef.current?.click()}
                    disabled={mediaUploading}
                    style={{ backgroundColor: GOLD_BG, color: GOLD, border: `1px solid ${GOLD}55`, borderRadius: "8px", padding: "7px 14px", fontSize: "12px", fontWeight: 700, cursor: mediaUploading ? "wait" : "pointer", fontFamily: "'Cairo', sans-serif", whiteSpace: "nowrap" }}
                  >
                    {mediaUploading ? tx.uploadingMedia : tx.addPhoto}
                  </button>
                  {/* Video upload */}
                  <input ref={videoRef} type="file" accept="video/*" style={{ display: "none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) { handleMediaUpload(f, "video"); e.target.value = ""; } }} />
                  <button
                    onClick={() => videoRef.current?.click()}
                    disabled={mediaUploading}
                    style={{ backgroundColor: dark ? "#1a1a2e" : "#ede9fe", color: "#a78bfa", border: `1px solid #a78bfa55`, borderRadius: "8px", padding: "7px 14px", fontSize: "12px", fontWeight: 700, cursor: mediaUploading ? "wait" : "pointer", fontFamily: "'Cairo', sans-serif", whiteSpace: "nowrap" }}
                  >
                    {mediaUploading ? tx.uploadingMedia : tx.addVideo}
                  </button>
                </div>
              </div>

              {/* Filter tabs */}
              {media.length > 0 && (
                <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
                  {[["all", tx.all], ["photo", tx.photos], ["video", tx.videos]].map(([k, label]) => (
                    <button key={k} onClick={() => setFilter(k as any)} style={{
                      padding: "4px 14px", borderRadius: "20px",
                      border: `1px solid ${filter === k ? GOLD : BORDER}`,
                      backgroundColor: filter === k ? GOLD_BG : "transparent",
                      color: filter === k ? GOLD : MUTED,
                      fontSize: "12px", cursor: "pointer", fontFamily: "'Cairo', sans-serif",
                    }}>{label}</button>
                  ))}
                </div>
              )}

              {/* Upload progress */}
              {mediaUploading && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", backgroundColor: GOLD_BG, borderRadius: "8px", marginBottom: "14px", border: `1px solid ${GOLD}44` }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${GOLD}44`, borderTopColor: GOLD, animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                  <span style={{ color: GOLD, fontSize: "13px", fontWeight: 600 }}>{tx.uploadingMedia}</span>
                </div>
              )}

              {/* Upload error */}
              {uploadErr && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "rgba(220,38,38,0.1)", borderRadius: "8px", marginBottom: "14px", border: "1px solid rgba(220,38,38,0.4)" }}>
                  <span style={{ color: "#f87171", fontSize: "13px", fontWeight: 600 }}>⚠️ {uploadErr}</span>
                  <button onClick={() => setUploadErr("")} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "16px", padding: "0 4px" }}>✕</button>
                </div>
              )}

              {/* Grid */}
              {filteredMedia.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: MUTED, fontSize: "14px" }}>
                  {tx.noMedia}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                  {filteredMedia.map(item => (
                    <MediaCard
                      key={item.id}
                      item={item}
                      onDelete={handleDeleteMedia}
                      BORDER={BORDER}
                      ELV={ELV}
                      MUTED={MUTED}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════════════ EDIT MODE ══════════════════ */}
        {edit && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Avatar */}
            <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ width: "90px", height: "90px", borderRadius: "50%", border: `2px solid ${GOLD}`, overflow: "hidden", backgroundColor: ELV, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {form.avatar_url
                  ? <img src={form.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  : <span style={{ color: GOLD, fontSize: "28px", fontWeight: 800 }}>{form.full_name?.[0] ?? "?"}</span>}
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ backgroundColor: GOLD, color: "#000", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 700, fontFamily: "'Cairo', sans-serif" }}>
                  {uploading ? tx.uploading : tx.changePhoto}
                </button>
              </div>
            </div>

            <EditCard title={tx.accountInfo} CARD={CARD} BORDER={BORDER} TEXT={TEXT} GOLD={GOLD}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label={tx.fullName} val={form.full_name} onChange={(v: string) => setF("full_name", v)} inp={inp} lbl={lbl} />
                <Field label={tx.handle}   val={form.handle}    onChange={(v: string) => setF("handle", v.toLowerCase().replace(/[^a-z0-9-]/g,""))} inp={inp} lbl={lbl} dir="ltr" />
                <Field label={tx.city}     val={form.city}      onChange={(v: string) => setF("city", v)} inp={inp} lbl={lbl} />
                {tp && (
                  <div>
                    <label style={lbl}>{tx.availability}</label>
                    <select value={form.availability} onChange={e => setF("availability", e.target.value)} style={{ ...inp }}>
                      <option value="available">{tx.available}</option>
                      <option value="unavailable">{tx.unavailable}</option>
                    </select>
                  </div>
                )}
              </div>
              <div style={{ marginTop: "14px" }}>
                <label style={lbl}>{tx.bio}</label>
                <textarea value={form.bio} onChange={e => setF("bio", e.target.value)} rows={3} placeholder={tx.bioPlaceholder}
                  style={{ ...inp, resize: "vertical", lineHeight: 1.7 }} />
              </div>
            </EditCard>

            <EditCard title={tx.socialLinks} CARD={CARD} BORDER={BORDER} TEXT={TEXT} GOLD={GOLD}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label="Instagram" val={form.instagram} onChange={(v: string) => setF("instagram", v)} inp={inp} lbl={lbl} dir="ltr" />
                <Field label="TikTok"    val={form.tiktok}    onChange={(v: string) => setF("tiktok", v)}    inp={inp} lbl={lbl} dir="ltr" />
                <Field label="YouTube"   val={form.youtube}   onChange={(v: string) => setF("youtube", v)}   inp={inp} lbl={lbl} dir="ltr" />
                <Field label="LinkedIn"  val={form.linkedin}  onChange={(v: string) => setF("linkedin", v)}  inp={inp} lbl={lbl} dir="ltr" />
              </div>
            </EditCard>

            {tp && (
              <EditCard title={tx.physicalInfo} CARD={CARD} BORDER={BORDER} TEXT={TEXT} GOLD={GOLD}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <Field label={tx.height}    val={form.height}     onChange={(v: string) => setF("height", v)}     inp={inp} lbl={lbl} dir="ltr" />
                  <Field label={tx.weight}    val={form.weight}     onChange={(v: string) => setF("weight", v)}     inp={inp} lbl={lbl} dir="ltr" />
                  <Field label={tx.hairColor} val={form.hair_color} onChange={(v: string) => setF("hair_color", v)} inp={inp} lbl={lbl} />
                  <Field label={tx.eyeColor}  val={form.eye_color}  onChange={(v: string) => setF("eye_color", v)}  inp={inp} lbl={lbl} />
                  <Field label={tx.languages} val={form.languages}  onChange={(v: string) => setF("languages", v)}  inp={inp} lbl={lbl} />
                  <Field label={tx.ageRange}  val={form.age_range}  onChange={(v: string) => setF("age_range", v)}  inp={inp} lbl={lbl} />
                </div>
              </EditCard>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setEdit(false)} style={{ flex: 1, padding: "12px", backgroundColor: ELV, border: `1px solid ${BORDER}`, borderRadius: "10px", color: SUB, fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "'Cairo', sans-serif" }}>
                {tx.cancel}
              </button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: "13px", backgroundColor: GOLD, border: "none", borderRadius: "10px", color: "#000", fontSize: "15px", fontWeight: 800, cursor: saving ? "wait" : "pointer", fontFamily: "'Cairo', sans-serif", boxShadow: `0 4px 14px ${GOLD_GLW}` }}>
                {saveMsg || (saving ? tx.saving : tx.saveChanges)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Media card with hover-delete ─────────────────────────────────────────────
function MediaCard({ item, onDelete, BORDER, ELV, MUTED }: { item: MediaItem; onDelete: (id: string) => void; BORDER: string; ELV: string; MUTED: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", aspectRatio: "4/3", backgroundColor: ELV, borderRadius: "10px", overflow: "hidden", border: `1px solid ${BORDER}`, cursor: "pointer" }}
    >
      {item.media_type === "video" ? (
        <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted playsInline />
      ) : (
        <img src={item.url} alt={item.caption ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}

      {/* Video overlay icon */}
      {item.media_type === "video" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.25)", pointerEvents: "none" }}>
          <span style={{ fontSize: "32px" }}>▶</span>
        </div>
      )}

      {/* Caption */}
      {item.caption && (
        <span style={{ position: "absolute", bottom: "8px", right: "8px", backgroundColor: "rgba(0,0,0,0.65)", color: "#fff", fontSize: "11px", borderRadius: "4px", padding: "2px 7px" }}>
          {item.caption}
        </span>
      )}

      {/* Type badge */}
      <span style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: item.media_type === "video" ? "rgba(167,139,250,0.9)" : "rgba(255,184,0,0.9)", color: "#000", fontSize: "10px", fontWeight: 700, borderRadius: "4px", padding: "2px 6px" }}>
        {item.media_type === "video" ? "VIDEO" : "IMG"}
      </span>

      {/* Delete button on hover */}
      {hovered && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(item.id); }}
          style={{ position: "absolute", top: "8px", left: "8px", backgroundColor: "rgba(220,38,38,0.9)", color: "#fff", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >✕</button>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Section({ title, children, CARD, BORDER, TEXT, GOLD }: any) {
  return (
    <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px" }}>
      <p style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "2px", marginBottom: "14px" }}>{title.toUpperCase()}</p>
      {children}
    </div>
  );
}
function EditCard({ title, children, CARD, BORDER, TEXT, GOLD }: any) {
  return (
    <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "22px" }}>
      <p style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "2px", marginBottom: "16px" }}>{title.toUpperCase()}</p>
      {children}
    </div>
  );
}
function Row({ label, val, MUTED, TEXT, BORDER }: any) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ color: MUTED, fontSize: "13px" }}>{label}</span>
      <span style={{ color: TEXT, fontSize: "13px", fontWeight: 600 }}>{val}</span>
    </div>
  );
}
function Field({ label, val, onChange, inp, lbl, dir }: any) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input value={val} onChange={e => onChange(e.target.value)} dir={dir ?? "rtl"} style={inp} />
    </div>
  );
}
