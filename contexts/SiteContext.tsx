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

function getTimeBasedMode(): Mode {
  const h = new Date().getHours();
  return h >= 6 && h < 18 ? "light" : "dark";
}

export function SiteProvider({ children }: { children: ReactNode }) {
  // Read directly from DOM attributes that the blocking <head> script already set.
  // This runs synchronously in the lazy initializer (client-only) so React state
  // matches the DOM from the very first render — no flash, no useEffect delay.
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    const attr = document.documentElement.getAttribute("lang");
    return attr === "ar" || attr === "en" ? attr : "ar";
  });
  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window === "undefined") return "dark";
    const attr = document.documentElement.getAttribute("data-theme");
    return attr === "dark" || attr === "light" ? attr : getTimeBasedMode();
  });

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("site_language", l);
    document.documentElement.setAttribute("lang", l);
    document.documentElement.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
  }

  function setMode(m: Mode) {
    setModeState(m);
    localStorage.setItem("site_theme", m);
    document.documentElement.setAttribute("data-theme", m);
  }

  return (
    <SiteContext.Provider value={{
      lang, setLang,
      mode, setMode,
      dark: mode === "dark",
      toggleLang: () => setLang(lang === "ar" ? "en" : "ar"),
      toggleMode: () => setMode(mode === "dark" ? "light" : "dark"),
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
