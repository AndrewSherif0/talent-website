"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Tab = "login" | "register";
type Role = "talent" | "client";
type Lang = "ar" | "en";
type Mode = "dark" | "light";

const t = {
  ar: {
    welcome:        "WELCOME BACK //",
    heading:        "أهلاً بيك من جديد",
    sub:            "سجل دخولك وكمّل من حيث وقفت",
    tabLogin:       "تسجيل الدخول",
    tabRegister:    "إنشاء حساب",
    fullName:       "الاسم الكامل",
    namePH:         "مثلاً: سارة أحمد",
    email:          "البريد الإلكتروني",
    emailPH:        "example@email.com",
    password:       "كلمة المرور",
    passwordPH:     "8 أحرف على الأقل",
    forgot:         "نسيت كلمة المرور؟",
    loginBtn:       "دخول ←",
    registerBtn:    "إنشاء الحساب ←",
    or:             "أو",
    google:         "دخول بـ Google",
    noAccount:      "ما عندكش حساب؟",
    signupFree:     "سجّل خكموها مجاناً",
    accountType:    "نوع الحساب",
    talent:         "موهبة / كريتور",
    client:         "براند / عميل",
    talentFull:     "موهبة؟ سجّل بالخطوات الكاملة ←",
    terms:          "بالتسجيل توافق على",
    termsLink:      "الشروط والأحكام",
    brand:          "منصة المواهب",
    brandHighlight: "العربية.",
    brandDesc:      "موديلز، UGC Creators، وإنفلونسرز — كلهم في مكان واحد. براندات موثقة. تعاون حقيقي.",
    stat1:          "متوسط التقييم",
    stat2:          "براند",
    stat3:          "موهبة",
    loading:        "جاري...",
    error:          "حدث خطأ، حاول مرة أخرى",
  },
  en: {
    welcome:        "WELCOME BACK //",
    heading:        "Welcome Back",
    sub:            "Sign in and continue where you left off",
    tabLogin:       "Sign In",
    tabRegister:    "Create Account",
    fullName:       "Full Name",
    namePH:         "e.g. Sara Ahmed",
    email:          "Email",
    emailPH:        "example@email.com",
    password:       "Password",
    passwordPH:     "At least 8 characters",
    forgot:         "Forgot password?",
    loginBtn:       "Sign In →",
    registerBtn:    "Create Account →",
    or:             "or",
    google:         "Continue with Google",
    noAccount:      "Don't have an account?",
    signupFree:     "Sign up for free",
    accountType:    "Account Type",
    talent:         "Talent / Creator",
    client:         "Brand / Client",
    talentFull:     "Talent? Full registration →",
    terms:          "By signing up you agree to our",
    termsLink:      "Terms & Conditions",
    brand:          "Arab Talent",
    brandHighlight: "Platform.",
    brandDesc:      "Models, UGC Creators, and Influencers — all in one place. Verified brands. Real collaboration.",
    stat1:          "Avg Rating",
    stat2:          "Brands",
    stat3:          "Talents",
    loading:        "Loading...",
    error:          "Something went wrong, try again",
  },
};

const floatingTalents = [
  { name: "سارة أحمد", sub: "Fashion · 8.4k", color: "#00C9B1" },
  { name: "عمر خالد", sub: "UGC · 12k",      color: "#FFB800" },
  { name: "مي حسين",  sub: "Model · 5.2k",   color: "#8B2FC9" },
];

export default function AuthPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [tab,         setTab]         = useState<Tab>("login");
  const [role,        setRole]        = useState<Role>("talent");
  const [lang,        setLang]        = useState<Lang>("ar");
  const [mode,        setMode]        = useState<Mode>("dark");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [form,        setForm]        = useState({ name: "", email: "", password: "" });

  const tx  = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const dark  = mode === "dark";
  const bg    = dark ? "#0a0a0a"   : "#f5f5f0";
  const card  = dark ? "#111111"   : "#ffffff";
  const text  = dark ? "#f1f5f9"   : "#0f172a";
  const muted = dark ? "#6b7280"   : "#64748b";
  const input = dark ? "#1a1a1a"   : "#f8fafc";
  const bord  = dark ? "#2a2a2a"   : "#e2e8f0";
  const gold  = "#FFB800";

  async function handleLogin() {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password,
    });
    setLoading(false);
    if (error) { setError(tx.error); return; }
    router.push("/");
  }

  async function handleRegister() {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, role } },
    });
    setLoading(false);
    if (error) { setError(tx.error); return; }
    router.push("/");
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", backgroundColor: bg,
      fontFamily: "'Cairo', sans-serif", direction: dir,
    }}>

      {/* ── FORM SIDE ─────────────────────────────── */}
      <div style={{
        width: "42%", minWidth: "380px", display: "flex",
        flexDirection: "column", justifyContent: "center",
        padding: "48px 56px", position: "relative",
      }}>

        {/* Top controls */}
        <div style={{ position: "absolute", top: "24px", [lang==="ar"?"right":"left"]: "24px", display: "flex", gap: "8px" }}>
          <button onClick={() => setLang(lang==="ar"?"en":"ar")} style={{
            background: bord, border: "none", borderRadius: "6px",
            padding: "4px 10px", cursor: "pointer", color: muted, fontSize: "12px", fontWeight: 600,
          }}>
            {lang === "ar" ? "EN" : "ع"}
          </button>
          <button onClick={() => setMode(dark?"light":"dark")} style={{
            background: bord, border: "none", borderRadius: "6px",
            padding: "4px 10px", cursor: "pointer", color: muted, fontSize: "13px",
          }}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Heading */}
        <p style={{ color: gold, fontSize: "11px", fontWeight: 700, letterSpacing: "3px", marginBottom: "8px" }}>
          {tx.welcome}
        </p>
        <h1 style={{ color: text, fontSize: "32px", fontWeight: 800, margin: "0 0 6px" }}>
          {tx.heading}
        </h1>
        <p style={{ color: muted, fontSize: "14px", marginBottom: "32px" }}>
          {tx.sub}
        </p>

        {/* Tabs */}
        <div style={{
          display: "flex", borderRadius: "10px", overflow: "hidden",
          border: `1px solid ${bord}`, marginBottom: "28px",
        }}>
          {(["login","register"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "10px", border: "none", cursor: "pointer",
              fontFamily: "'Cairo', sans-serif", fontSize: "14px", fontWeight: 700,
              backgroundColor: tab === t ? gold : "transparent",
              color:           tab === t ? "#000" : muted,
              transition: "all 0.2s",
            }}>
              {t === "login" ? tx.tabLogin : tx.tabRegister}
            </button>
          ))}
        </div>

        {/* ── LOGIN FORM ── */}
        {tab === "login" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Field label={tx.email} value={form.email}
              placeholder={tx.emailPH} type="email"
              onChange={v => setForm({...form, email: v})}
              input={input} bord={bord} text={text} muted={muted} />

            <div>
              <label style={{ color: muted, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                {tx.password}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder={tx.passwordPH}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  style={{
                    width: "100%", padding: "10px 40px 10px 14px",
                    backgroundColor: input, border: `1px solid ${bord}`,
                    borderRadius: "8px", color: text, fontSize: "14px",
                    outline: "none", boxSizing: "border-box", direction: "ltr",
                    fontFamily: "'Cairo', sans-serif",
                  }}
                />
                <button onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", top: "50%", [lang==="ar"?"right":"left"]: "12px",
                  transform: "translateY(-50%)", background: "none", border: "none",
                  cursor: "pointer", color: muted, fontSize: "14px",
                }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div style={{ textAlign: lang==="ar"?"left":"right" }}>
              <Link href="/forgot-password" style={{ color: gold, fontSize: "13px", textDecoration: "none" }}>
                {tx.forgot}
              </Link>
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: "13px", textAlign: "center" }}>{error}</p>}

            <button onClick={handleLogin} disabled={loading} style={{
              backgroundColor: gold, color: "#000", border: "none",
              borderRadius: "8px", padding: "13px", fontSize: "15px",
              fontWeight: 800, cursor: "pointer", fontFamily: "'Cairo', sans-serif",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? tx.loading : tx.loginBtn}
            </button>

            <p style={{ textAlign: "center", color: muted, fontSize: "13px" }}>
              {tx.noAccount}{" "}
              <button onClick={() => setTab("register")} style={{
                background: "none", border: "none", color: gold,
                cursor: "pointer", fontSize: "13px", fontWeight: 700,
                fontFamily: "'Cairo', sans-serif",
              }}>
                {tx.signupFree}
              </button>
            </p>
          </div>
        )}

        {/* ── REGISTER FORM ── */}
        {tab === "register" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Field label={tx.fullName} value={form.name}
              placeholder={tx.namePH} type="text"
              onChange={v => setForm({...form, name: v})}
              input={input} bord={bord} text={text} muted={muted} />

            <Field label={tx.email} value={form.email}
              placeholder={tx.emailPH} type="email"
              onChange={v => setForm({...form, email: v})}
              input={input} bord={bord} text={text} muted={muted} />

            <div>
              <label style={{ color: muted, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                {tx.password}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder={tx.passwordPH}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  style={{
                    width: "100%", padding: "10px 40px 10px 14px",
                    backgroundColor: input, border: `1px solid ${bord}`,
                    borderRadius: "8px", color: text, fontSize: "14px",
                    outline: "none", boxSizing: "border-box", direction: "ltr",
                    fontFamily: "'Cairo', sans-serif",
                  }}
                />
                <button onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", top: "50%", [lang==="ar"?"right":"left"]: "12px",
                  transform: "translateY(-50%)", background: "none", border: "none",
                  cursor: "pointer", color: muted, fontSize: "14px",
                }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Account type */}
            <div>
              <label style={{ color: muted, fontSize: "13px", display: "block", marginBottom: "8px" }}>
                {tx.accountType}
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                {(["talent","client"] as Role[]).map((r) => (
                  <button key={r} onClick={() => setRole(r)} style={{
                    flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif", fontSize: "13px", fontWeight: 700,
                    border: `1px solid ${role===r ? gold : bord}`,
                    backgroundColor: role===r ? (dark?"#1a1500":"#fff8e1") : "transparent",
                    color: role===r ? gold : muted,
                    transition: "all 0.2s",
                  }}>
                    {r === "talent" ? `✦ ${tx.talent}` : `🏢 ${tx.client}`}
                  </button>
                ))}
              </div>
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: "13px", textAlign: "center" }}>{error}</p>}

            <button onClick={handleRegister} disabled={loading} style={{
              backgroundColor: gold, color: "#000", border: "none",
              borderRadius: "8px", padding: "13px", fontSize: "15px",
              fontWeight: 800, cursor: "pointer", fontFamily: "'Cairo', sans-serif",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? tx.loading : tx.registerBtn}
            </button>

            {role === "talent" && (
              <p style={{ textAlign: "center" }}>
                <Link href="/register/talent" style={{ color: gold, fontSize: "13px", textDecoration: "none", fontWeight: 700 }}>
                  {tx.talentFull}
                </Link>
              </p>
            )}

            <p style={{ textAlign: "center", color: muted, fontSize: "12px" }}>
              {tx.terms}{" "}
              <Link href="/terms" style={{ color: gold, textDecoration: "none" }}>
                {tx.termsLink}
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* ── BRANDING SIDE ─────────────────────────── */}
      <div style={{
        flex: 1, position: "relative", overflow: "hidden",
        backgroundColor: "#0a0a0a",
        backgroundImage: "radial-gradient(ellipse at 30% 60%, rgba(255,184,0,0.08) 0%, transparent 60%)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "32px 48px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: lang==="ar"?"right":"left" }}>
          <Image src="/assets/logo.png" alt="Talents" width={110} height={32}
            style={{ height: "32px", width: "auto", filter: dark?"brightness(1)":"brightness(0.1)" }} />
        </div>

        {/* Floating talent cards */}
        <div style={{ position: "absolute", left: "48px", top: "50%", transform: "translateY(-60%)", display: "flex", flexDirection: "column", gap: "12px" }}>
          {floatingTalents.map((tl, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "10px",
              backgroundColor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px", padding: "10px 14px",
              opacity: 0.85,
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                backgroundColor: tl.color + "33",
                border: `2px solid ${tl.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 700, color: tl.color,
              }}>
                {tl.name[0]}
              </div>
              <div>
                <p style={{ color: "#f1f5f9", fontSize: "13px", fontWeight: 700, margin: 0 }}>{tl.name}</p>
                <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>{tl.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Headline */}
        <div style={{ textAlign: lang==="ar"?"right":"left" }}>
          <h2 style={{ color: "#f1f5f9", fontSize: "52px", fontWeight: 900, lineHeight: 1.15, margin: "0 0 16px" }}>
            {tx.brand}<br />
            <span style={{ color: gold, fontStyle: "italic" }}>{tx.brandHighlight}</span>
          </h2>
          <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.7, maxWidth: "320px", margin: lang==="ar"?"0 0 0 auto":"0 auto 0 0" }}>
            {tx.brandDesc}
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "40px", marginTop: "40px", justifyContent: lang==="ar"?"flex-end":"flex-start" }}>
            {[
              { val: "4.9", label: tx.stat1 },
              { val: "83",  label: tx.stat2 },
              { val: "+247",label: tx.stat3 },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: lang==="ar"?"right":"left" }}>
                <p style={{ color: gold, fontSize: "22px", fontWeight: 900, margin: 0 }}>{s.val}</p>
                <p style={{ color: "#6b7280", fontSize: "12px", margin: "2px 0 0" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, placeholder, type, onChange, input, bord, text, muted }: {
  label: string; value: string; placeholder: string; type: string;
  onChange: (v: string) => void;
  input: string; bord: string; text: string; muted: string;
}) {
  return (
    <div>
      <label style={{ color: muted, fontSize: "13px", display: "block", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px",
          backgroundColor: input, border: `1px solid ${bord}`,
          borderRadius: "8px", color: text, fontSize: "14px",
          outline: "none", boxSizing: "border-box",
          fontFamily: "'Cairo', sans-serif",
          direction: type === "email" ? "ltr" : "inherit",
        }}
      />
    </div>
  );
}
