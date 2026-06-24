"use client";
import { useState } from "react";

const tabs = [
  { key: "overview",   label: "نبذة عامة" },
  { key: "portfolio",  label: "الصور والفيديو" },
  { key: "shoots",     label: "خبرات سابقة" },
  { key: "verified",   label: "تم التحقق", badge: "جديد" },
  { key: "reviews",    label: "تقييمات (86)" },
  { key: "packages",   label: "الأسعار والباقات" },
];

export default function ProfileTabs({ activeTab, onTabChange }: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div style={{
      display: "flex",
      gap: "4px",
      borderBottom: "1px solid var(--bg-border)",
      marginBottom: "16px",
      overflowX: "auto",
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: activeTab === tab.key ? 700 : 500,
            color: activeTab === tab.key ? "var(--color-teal)" : "var(--text-muted)",
            borderBottom: activeTab === tab.key ? "2px solid var(--color-teal)" : "2px solid transparent",
            whiteSpace: "nowrap",
            fontFamily: "'Cairo', sans-serif",
            display: "flex", alignItems: "center", gap: "6px",
            transition: "all 0.2s",
          }}
        >
          {tab.label}
          {tab.badge && (
            <span style={{
              backgroundColor: "var(--color-orange)",
              color: "#fff", fontSize: "10px", fontWeight: 700,
              borderRadius: "4px", padding: "1px 5px",
            }}>{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}
