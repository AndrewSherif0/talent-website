"use client";
import { useSite } from "@/contexts/SiteContext";
import AdminShell from "@/components/admin/AdminShell";
import EmptyState from "@/components/admin/EmptyState";
import type { AdminBooking } from "@/features/admin/types";

const TX = {
  ar: { title: "الحجوزات", id: "المعرف", brand: "الشركة", talent: "الموهبة", status: "الحالة", date: "التاريخ" },
  en: { title: "Bookings",  id: "ID",      brand: "Brand",    talent: "Talent",  status: "Status", date: "Date" },
};

export default function AdminBookingsClient({ bookings }: { bookings: AdminBooking[] }) {
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
        {bookings.length === 0 ? <EmptyState /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>{t.id}</th>
                  <th style={thStyle}>{t.brand}</th>
                  <th style={thStyle}>{t.talent}</th>
                  <th style={thStyle}>{t.status}</th>
                  <th style={thStyle}>{t.date}</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => {
                  const brand  = Array.isArray(b.brand)  ? b.brand[0]  : b.brand;
                  const talent = Array.isArray(b.talent) ? b.talent[0] : b.talent;
                  return (
                    <tr key={b.id}>
                      <td style={{ ...cellStyle, color: MUTED, fontSize: 11 }}>{b.id.slice(0, 8)}…</td>
                      <td style={cellStyle}>{brand?.full_name ?? "—"}</td>
                      <td style={cellStyle}>{talent?.full_name ?? "—"}</td>
                      <td style={cellStyle}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                          backgroundColor: b.status === "completed" ? "rgba(0,210,106,0.12)" : "rgba(244,183,64,0.12)",
                          color: b.status === "completed" ? "#00D26A" : "#F4B740",
                        }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ ...cellStyle, color: MUTED }}>
                        {new Date(b.created_at).toLocaleDateString(ar ? "ar-EG" : "en-US")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
