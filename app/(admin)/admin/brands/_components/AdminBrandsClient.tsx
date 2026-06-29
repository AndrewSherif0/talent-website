"use client";
import { useSite } from "@/contexts/SiteContext";
import AdminShell from "@/components/admin/AdminShell";
import EmptyState from "@/components/admin/EmptyState";

const TX = {
  ar: { title: "الشركات", name: "الاسم", username: "اسم المستخدم", city: "المدينة", registered: "تاريخ التسجيل" },
  en: { title: "Brands",   name: "Name",   username: "Username",     city: "City",     registered: "Registered" },
};

interface Brand { id: string; full_name: string | null; handle: string | null; city: string | null; created_at: string; }

export default function AdminBrandsClient({ brands }: { brands: Brand[] }) {
  const { dark, lang } = useSite();
  const t = TX[lang];
  const ar = lang === "ar";

  const CARD   = dark ? "#0D1623" : "#FFFFFF";
  const BORDER = dark ? "#1e293b" : "#E2E8F0";
  const TEXT   = dark ? "#f1f5f9" : "#0f172a";
  const MUTED  = dark ? "#94a3b8" : "#64748b";
  const TH     = dark ? "#0a121c" : "#f8fafc";

  const cellStyle: React.CSSProperties = { padding: "12px 14px", color: TEXT, fontSize: 13, borderBottom: `1px solid ${BORDER}` };
  const thStyle: React.CSSProperties   = { padding: "10px 14px", color: MUTED, fontSize: 12, fontWeight: 600, textAlign: ar ? "right" : "left", backgroundColor: TH, borderBottom: `1px solid ${BORDER}` };

  return (
    <AdminShell title={t.title}>
      <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
        {brands.length === 0 ? <EmptyState /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>{t.name}</th>
                  <th style={thStyle}>{t.username}</th>
                  <th style={thStyle}>{t.city}</th>
                  <th style={thStyle}>{t.registered}</th>
                </tr>
              </thead>
              <tbody>
                {brands.map(b => (
                  <tr key={b.id}>
                    <td style={cellStyle}>{b.full_name ?? "—"}</td>
                    <td style={{ ...cellStyle, color: MUTED }}>{b.handle ? `@${b.handle}` : "—"}</td>
                    <td style={cellStyle}>{b.city ?? "—"}</td>
                    <td style={{ ...cellStyle, color: MUTED }}>
                      {new Date(b.created_at).toLocaleDateString(ar ? "ar-EG" : "en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
