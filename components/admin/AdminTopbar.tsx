"use client";
import { useState } from "react";
import { useSite } from "@/contexts/SiteContext";
import { Menu, Sun, Moon, Globe, Bell, Search } from "lucide-react";

interface Props {
  title: string;
  onMenuClick: () => void;
}

export default function AdminTopbar({ title, onMenuClick }: Props) {
  const { dark, toggleMode, lang, toggleLang } = useSite();
  const [search, setSearch] = useState("");

  const BG     = dark ? "#090e1a" : "#ffffff";
  const BORDER = dark ? "#1e293b" : "#e2e8f0";
  const TEXT   = dark ? "#f1f5f9" : "#0f172a";
  const MUTED  = dark ? "#94a3b8" : "#64748b";
  const INPUT  = dark ? "#0d1527" : "#f1f5f9";
  const ar     = lang === "ar";

  const iconBtn = (onClick: () => void, children: React.ReactNode, title_: string) => (
    <button
      onClick={onClick}
      title={title_}
      style={{
        background: "none", border: `1px solid ${BORDER}`, borderRadius: 8,
        padding: 8, cursor: "pointer", color: MUTED, display: "flex",
        alignItems: "center", justifyContent: "center",
        transition: "border-color 0.15s",
      }}
    >
      {children}
    </button>
  );

  return (
    <header
      style={{
        backgroundColor: BG,
        borderBottom: `1px solid ${BORDER}`,
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="admin-menu-btn"
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: MUTED, display: "none", alignItems: "center",
        }}
      >
        <Menu size={22} />
      </button>

      {/* Page title — centered absolutely so it stays in the middle regardless of left/right content */}
      <h1 style={{
        color: TEXT, fontSize: 18, fontWeight: 800, margin: 0,
        position: "absolute", left: "50%", transform: "translateX(-50%)",
        pointerEvents: "none", whiteSpace: "nowrap",
      }}>
        {title}
      </h1>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 360, position: "relative" }}>
        <Search
          size={16}
          style={{
            position: "absolute",
            top: "50%", transform: "translateY(-50%)",
            [ar ? "right" : "left"]: 12,
            color: MUTED, pointerEvents: "none",
          }}
        />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={ar ? "بحث..." : "Search..."}
          style={{
            width: "100%",
            backgroundColor: INPUT,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: ar ? "9px 38px 9px 14px" : "9px 14px 9px 38px",
            color: TEXT,
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
        {iconBtn(toggleLang, <Globe size={18} />, ar ? "English" : "عربي")}
        {iconBtn(toggleMode, dark ? <Sun size={18} /> : <Moon size={18} />, ar ? "تبديل المظهر" : "Toggle theme")}
        {iconBtn(() => {}, <Bell size={18} />, ar ? "الإشعارات" : "Notifications")}

        {/* Admin avatar placeholder */}
        <div
          style={{
            width: 34, height: 34, borderRadius: "50%",
            backgroundColor: "#00D26A22",
            border: "2px solid #00D26A44",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#00D26A", fontSize: 13, fontWeight: 800, cursor: "pointer",
          }}
        >
          A
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
