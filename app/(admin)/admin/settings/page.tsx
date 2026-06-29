"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useSite } from "@/contexts/SiteContext";

const TX = {
  ar: { title: "الإعدادات", soon: "قريباً — سيتم إضافة إعدادات لوحة التحكم هنا." },
  en: { title: "Settings",  soon: "Coming soon — admin settings will be added here." },
};

export default function AdminSettingsPage() {
  const { lang, dark } = useSite();
  const t = TX[lang];
  const MUTED = dark ? "#94a3b8" : "#64748b";

  return (
    <AdminShell title={t.title}>
      <div style={{ color: MUTED, fontSize: 15, padding: "60px 0", textAlign: "center" }}>
        {t.soon}
      </div>
    </AdminShell>
  );
}
