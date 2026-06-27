"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "ar" | "en";
export type Mode = "dark" | "light";

interface SiteContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  dark: boolean;
  toggleLang: () => void;
  toggleMode: () => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const [mode, setModeState] = useState<Mode>("dark");

  // Hydrate from localStorage after mount
  useEffect(() => {
    const storedLang = localStorage.getItem("site_lang") as Lang | null;
    const storedMode = localStorage.getItem("site_mode") as Mode | null;
    if (storedLang === "ar" || storedLang === "en") setLangState(storedLang);
    if (storedMode === "dark" || storedMode === "light") setModeState(storedMode);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("site_lang", l);
    // Update html dir attribute
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  }

  function setMode(m: Mode) {
    setModeState(m);
    localStorage.setItem("site_mode", m);
    // Apply dark/light class for potential CSS usage
    document.documentElement.setAttribute("data-theme", m);
  }

  function toggleLang() { setLang(lang === "ar" ? "en" : "ar"); }
  function toggleMode() { setMode(mode === "dark" ? "light" : "dark"); }

  return (
    <SiteContext.Provider value={{
      lang, setLang,
      mode, setMode,
      dark: mode === "dark",
      toggleLang, toggleMode,
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
