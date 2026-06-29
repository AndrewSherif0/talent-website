"use client";
import { useSite } from "@/contexts/SiteContext";
import AdminShell from "@/components/admin/AdminShell";
import EmptyState from "@/components/admin/EmptyState";
import type { AdminReview } from "@/features/admin/types";

const TX = {
  ar: { title: "التقييمات", brand: "الشركة", talent: "الموهبة", rating: "التقييم", comment: "التعليق", date: "التاريخ" },
  en: { title: "Reviews",    brand: "Brand",    talent: "Talent",  rating: "Rating",    comment: "Comment",   date: "Date" },
};

const STARS = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default function AdminReviewsClient({ reviews }: { reviews: AdminReview[] }) {
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
        {reviews.length === 0 ? <EmptyState /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>{t.brand}</th>
                  <th style={thStyle}>{t.talent}</th>
                  <th style={thStyle}>{t.rating}</th>
                  <th style={thStyle}>{t.comment}</th>
                  <th style={thStyle}>{t.date}</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => {
                  const brand  = Array.isArray(r.brand)  ? r.brand[0]  : r.brand;
                  const talent = Array.isArray(r.talent) ? r.talent[0] : r.talent;
                  return (
                    <tr key={r.id}>
                      <td style={cellStyle}>{brand?.full_name  ?? "—"}</td>
                      <td style={cellStyle}>{talent?.full_name ?? "—"}</td>
                      <td style={{ ...cellStyle, color: "#F4B740", letterSpacing: 1 }}>{STARS(r.rating)}</td>
                      <td style={{ ...cellStyle, color: MUTED, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.comment ?? "—"}
                      </td>
                      <td style={{ ...cellStyle, color: MUTED }}>
                        {new Date(r.created_at).toLocaleDateString(ar ? "ar-EG" : "en-US")}
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
