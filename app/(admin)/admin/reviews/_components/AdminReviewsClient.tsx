"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSite } from "@/contexts/SiteContext";
import AdminShell from "@/components/admin/AdminShell";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import type { AdminReview } from "@/features/admin/types";
import { Trash2 } from "lucide-react";

const TX = {
  ar: { title: "التقييمات", brand: "الشركة", talent: "الموهبة", rating: "التقييم", comment: "التعليق", date: "التاريخ", actions: "الإجراءات", confirmDelete: "حذف هذا التقييم نهائياً؟" },
  en: { title: "Reviews",   brand: "Brand",   talent: "Talent",  rating: "Rating",   comment: "Comment",   date: "Date",   actions: "Actions",    confirmDelete: "Permanently delete this review?" },
};

const STARS = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default function AdminReviewsClient({ reviews: initial }: { reviews: AdminReview[] }) {
  const { dark, lang } = useSite();
  const router = useRouter();
  const t = TX[lang];
  const ar = lang === "ar";

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const CARD   = dark ? "#0D1623" : "#FFFFFF";
  const BORDER = dark ? "#1e293b" : "#E2E8F0";
  const TEXT   = dark ? "#f1f5f9" : "#0f172a";
  const MUTED  = dark ? "#94a3b8" : "#64748b";
  const TH     = dark ? "#0a121c" : "#f8fafc";

  const cellStyle: React.CSSProperties = { padding: "12px 14px", color: TEXT, fontSize: 13, borderBottom: `1px solid ${BORDER}` };
  const thStyle: React.CSSProperties   = { padding: "10px 14px", color: MUTED, fontSize: 12, fontWeight: 600, textAlign: ar ? "right" : "left", backgroundColor: TH, borderBottom: `1px solid ${BORDER}` };

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    await fetch(`/api/admin/reviews/${deleteId}`, { method: "DELETE" });
    setLoading(false);
    setDeleteId(null);
    router.refresh();
  }

  return (
    <AdminShell title={t.title}>
      <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
        {initial.length === 0 ? <EmptyState /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>{t.brand}</th>
                  <th style={thStyle}>{t.talent}</th>
                  <th style={thStyle}>{t.rating}</th>
                  <th style={thStyle}>{t.comment}</th>
                  <th style={thStyle}>{t.date}</th>
                  <th style={thStyle}>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {initial.map(r => {
                  const brand  = Array.isArray(r.brand)  ? r.brand[0]  : r.brand;
                  const talent = Array.isArray(r.talent) ? r.talent[0] : r.talent;
                  return (
                    <tr key={r.id}>
                      <td style={cellStyle}>{brand?.full_name  ?? "—"}</td>
                      <td style={cellStyle}>{talent?.full_name ?? "—"}</td>
                      <td style={{ ...cellStyle, color: "#F4B740", letterSpacing: 1 }}>{STARS(r.rating)}</td>
                      <td style={{ ...cellStyle, color: MUTED, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.comment ?? "—"}
                      </td>
                      <td style={{ ...cellStyle, color: MUTED }}>
                        {new Date(r.created_at).toLocaleDateString(ar ? "ar-EG" : "en-US")}
                      </td>
                      <td style={cellStyle}>
                        <button
                          onClick={() => setDeleteId(r.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", padding: 4, borderRadius: 6, display: "flex" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationModal
        open={!!deleteId}
        title={t.confirmDelete}
        confirmColor="#EF4444"
        confirmLabel={loading ? (ar ? "جاري..." : "Deleting...") : (ar ? "حذف" : "Delete")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminShell>
  );
}
