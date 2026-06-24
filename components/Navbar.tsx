"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { label: "استكشاف", href: "/explore" },
  { label: "المجتمع", href: "/community" },
  { label: "وظائف", href: "/jobs" },
  { label: "للشركات", href: "/brands" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        zIndex: 50,
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: "#090e1a",
        borderBottom: "1px solid #1e293b",
        backdropFilter: "blur(12px)",
        direction: "rtl",
      }}>

        {/* RIGHT: Logo + Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <Image
              src="/assets/logo.png"
              alt="Talents"
              width={110}
              height={32}
              style={{ height: "32px", width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>

          {/* Search bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#0d1527",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            padding: "6px 12px",
            width: "220px",
          }}>
            <svg width="14" height="14" fill="none" stroke="#475569" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="ابحث عن مواهب أو خدمات..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#f1f5f9",
                fontSize: "13px",
                width: "100%",
                direction: "rtl",
              }}
            />
          </div>
        </div>

        {/* CENTER: Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f1f5f9")}
              onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* LEFT: Icons + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Messages */}
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: "#94a3b8", display: "flex" }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Notifications */}
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: "#94a3b8", display: "flex", position: "relative" }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span style={{
              position: "absolute",
              top: "4px",
              left: "4px",
              width: "16px",
              height: "16px",
              backgroundColor: "#FF6B2B",
              borderRadius: "50%",
              fontSize: "10px",
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>3</span>
          </button>

          {/* Avatar */}
          <button style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "2px solid #00C9B1",
            backgroundColor: "#111c35",
            color: "#00C9B1",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>م</button>

          {/* CTA */}
          <Link href="/book" style={{
            backgroundColor: "#00C9B1",
            color: "#000",
            fontWeight: 700,
            fontSize: "14px",
            padding: "8px 18px",
            borderRadius: "8px",
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "background-color 0.2s",
          }}>
            احجز الآن
          </Link>
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: "60px" }} />
    </>
  );
}
