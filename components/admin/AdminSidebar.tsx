"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSite } from "@/contexts/SiteContext";
import {
  LayoutDashboard, Users, Building2, CalendarCheck,
  Star, ShieldCheck, Settings, LogOut, X, User,
} from "lucide-react";

const TX = {
  ar: {
    dashboard:     "لوحة التحكم",
    talents:       "المواهب",
    brands:        "الشركات",
    bookings:      "الحجوزات",
    reviews:       "التقييمات",
    verifications: "طلبات التحقق",
    settings:      "الإعدادات",
    logout:        "تسجيل الخروج",
  },
  en: {
    dashboard:     "Dashboard",
    talents:       "Talents",
    brands:        "Brands",
    bookings:      "Bookings",
    reviews:       "Reviews",
    verifications: "Verifications",
    settings:      "Settings",
    logout:        "Logout",
  },
};

const NAV_ITEMS = [
  { key: "dashboard",     href: "/admin",                icon: LayoutDashboard },
  { key: "talents",       href: "/admin/talents",        icon: Users },
  { key: "brands",        href: "/admin/brands",          icon: Building2 },
  { key: "bookings",      href: "/admin/bookings",       icon: CalendarCheck },
  { key: "reviews",       href: "/admin/reviews",        icon: Star },
  { key: "verifications", href: "/admin/verifications",  icon: ShieldCheck },
  { key: "settings",      href: "/admin/settings",       icon: Settings },
] as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const { dark, lang } = useSite();
  const t = TX[lang];
  const ar = lang === "ar";

  const [adminName, setAdminName]     = useState<string | null>(null);
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then(r => r.json())
      .then(({ profile }) => {
        if (profile) {
          setAdminName(profile.full_name ?? null);
          setAdminAvatar(profile.avatar_url ?? null);
        }
      })
      .catch(() => {});
  }, []);

  const BG     = dark ? "#060c18" : "#0f172a";
  const ACTIVE = dark ? "#00D26A" : "#00D26A";
  const MUTED  = "rgba(255,255,255,0.55)";
  const HOVER  = "rgba(255,255,255,0.07)";

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 39,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "none",
          }}
          className="admin-overlay"
        />
      )}

      <aside
        style={{
          width: 240,
          minHeight: "100vh",
          backgroundColor: BG,
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          position: "sticky",
          top: 0,
          flexShrink: 0,
          transition: "transform 0.25s",
          zIndex: 40,
        }}
        className={`admin-sidebar${open ? " admin-sidebar-open" : ""}`}
      >
        {/* Logo Section with Profile Image */}
        <div style={{ padding: "0 20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            
            {/* Avatar */}
            <div style={{
              width: 40, height: 40, borderRadius: "50%", position: "relative",
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                position: "absolute", inset: -2, borderRadius: "50%",
                boxShadow: `0 0 10px 1px ${ACTIVE}`,
                border: `2px solid ${ACTIVE}`, opacity: 0.8,
              }} />
              {adminAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={adminAvatar}
                  alt="Admin"
                  style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", position: "relative", zIndex: 1 }}
                />
              ) : (
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(0,210,106,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1,
                }}>
                  <User size={18} color={ACTIVE} />
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <span style={{
                color: "#fff", fontWeight: 700, fontSize: 13,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                maxWidth: 120,
              }}>
                {adminName ?? (ar ? "المسؤول" : "Admin")}
              </span>
              <span style={{ color: ACTIVE, fontWeight: 500, fontSize: 11, marginTop: 1 }}>
                {ar ? "مسؤول النظام" : "System Admin"}
              </span>
            </div>
          </div>
          
          <button onClick={onClose} className="admin-close-btn" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "none" }}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
          {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={key}
                href={href}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  color: active ? ACTIVE : MUTED,
                  backgroundColor: active ? "rgba(0,210,106,0.1)" : "transparent",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: active ? 700 : 400,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = HOVER; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <Icon size={18} />
                {t[key]}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 12px 0" }}>
          <Link
            href="/api/auth/logout"
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 10,
              color: "rgba(239,68,68,0.8)", textDecoration: "none", fontSize: 14,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
          >
            <LogOut size={18} />
            {t.logout}
          </Link>
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
          }
          .admin-sidebar.admin-sidebar-open {
            transform: translateX(0);
          }
          .admin-overlay { display: block !important; }
          .admin-close-btn { display: flex !important; }
        }
        [dir="rtl"] .admin-sidebar {
          left: auto; right: 0;
          transform: translateX(100%);
        }
        [dir="rtl"] .admin-sidebar.admin-sidebar-open {
          transform: translateX(0);
        }
      `}</style>
    </>
  );
}