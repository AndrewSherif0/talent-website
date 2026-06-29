import { adminClient } from "@/lib/supabase/admin";
import type { AdminTalent, AdminDashboardStats, AdminBooking, AdminReview } from "../types";

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  const safe = async (q: { then: unknown }) => {
    try { const r = await (q as Promise<{ data: unknown[] | null }>); return (r.data ?? []).length; } catch { return 0; }
  };

  const [talents, brands, bookings, reviews, pending] = await Promise.all([
    safe(adminClient.from("talent_profiles").select("id")),
    safe(adminClient.from("profiles").select("id").eq("role", "brand")),
    safe(adminClient.from("bookings").select("id")),
    safe(adminClient.from("reviews").select("id")),
    safe(adminClient.from("talent_verifications").select("id").eq("status", "pending")),
  ]);

  return {
    pending,
    approved:  talents,
    rejected:  0,
    suspended: 0,
    brands,
    bookings,
    reviews,
  };
}

export async function fetchAdminTalents(statusFilter?: string): Promise<AdminTalent[]> {
  const { data } = await adminClient
    .from("profiles")
    .select(`
      id, handle, full_name, avatar_url, city, created_at,
      account_status, block_reason, is_verified, balance,
      talent_profiles (
        id, category, avg_rating, total_reviews
      )
    `)
    .eq("role", "talent")
    .order("created_at", { ascending: false });

  return (data ?? []).flatMap((p) => {
    const tp = Array.isArray(p.talent_profiles) ? p.talent_profiles[0] : p.talent_profiles;
    if (!tp) return [];

    const status: AdminTalent["status"] = "approved";
    if (statusFilter && statusFilter !== "all" && status !== statusFilter) return [];

    return [{
      profileId:       p.id,
      talentProfileId: tp.id,
      fullName:        p.full_name,
      handle:          p.handle,
      avatarUrl:       p.avatar_url,
      category:        tp.category,
      city:            p.city,
      createdAt:       p.created_at,
      status,
      approvedAt:      null,
      rejectionReason: null,
      avgRating:       tp.avg_rating    ?? null,
      totalReviews:    tp.total_reviews ?? null,
      accountStatus:   (p as Record<string, unknown>).account_status as string  ?? "active",
      blockReason:     (p as Record<string, unknown>).block_reason   as string  ?? null,
      isVerified:      (p as Record<string, unknown>).is_verified    as boolean ?? false,
      balance:         (p as Record<string, unknown>).balance        as number  ?? 0,
    }];
  });
}

export async function fetchAdminBookings(): Promise<AdminBooking[]> {
  const { data } = await adminClient
    .from("bookings")
    .select(`
      id, status, created_at, amount, notes, brief_url, paid_at, completed_at,
      brand:brand_id ( full_name, handle ),
      talent:talent_id ( full_name, handle )
    `)
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []) as AdminBooking[];
}

export async function fetchAdminReviews(): Promise<AdminReview[]> {
  // Try with new columns first (requires 002 migration)
  const { data, error } = await adminClient
    .from("reviews")
    .select(`
      id, rating, comment, status, proof_link, review_type, created_at,
      brand:brand_id ( full_name ),
      talent:talent_id ( full_name, handle )
    `)
    .order("created_at", { ascending: false })
    .limit(200);

  if (!error) return (data ?? []) as AdminReview[];

  // Fallback: select without migration columns
  const { data: basic } = await adminClient
    .from("reviews")
    .select(`
      id, rating, comment, created_at,
      brand:brand_id ( full_name ),
      talent:talent_id ( full_name, handle )
    `)
    .order("created_at", { ascending: false })
    .limit(200);

  return (basic ?? []).map((r) => ({
    ...r,
    status:      "approved" as const,
    proof_link:  null,
    review_type: "brand",
  })) as AdminReview[];
}

// ─── Verification requests ────────────────────────────────────────────────────
export interface AdminVerification {
  id:              string;
  talentId:        string;
  fullName:        string | null;
  handle:          string | null;
  avatarUrl:       string | null;
  status:          "pending" | "approved" | "rejected";
  submittedAt:     string;
  idDocumentUrl:   string | null;
  selfieUrl:       string | null;
  socialProof:     string | null;
  rejectionReason: string | null;
  isVerified:      boolean;
}

export async function fetchAdminVerifications(): Promise<AdminVerification[]> {
  // Step 1: fetch verification requests
  const { data: verifications, error } = await adminClient
    .from("talent_verifications")
    .select("id, talent_id, status, submitted_at, id_document_url, selfie_url, social_proof, rejection_reason")
    .order("submitted_at", { ascending: false });

  if (error || !verifications?.length) return [];

  // Step 2: fetch matching profiles in one query
  const talentIds = [...new Set(verifications.map(v => v.talent_id))];
  const { data: profiles } = await adminClient
    .from("profiles")
    .select("id, full_name, handle, avatar_url, is_verified")
    .in("id", talentIds);

  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]));

  return verifications.map((v) => {
    const p = profileMap[v.talent_id];
    return {
      id:              v.id,
      talentId:        v.talent_id,
      fullName:        p?.full_name   ?? null,
      handle:          p?.handle      ?? null,
      avatarUrl:       (p as Record<string, unknown>)?.avatar_url  as string  ?? null,
      status:          v.status as "pending" | "approved" | "rejected",
      submittedAt:     v.submitted_at,
      idDocumentUrl:   v.id_document_url  ?? null,
      selfieUrl:       v.selfie_url       ?? null,
      socialProof:     v.social_proof     ?? null,
      rejectionReason: v.rejection_reason ?? null,
      isVerified:      (p as Record<string, unknown>)?.is_verified as boolean ?? false,
    };
  });
}

// ─── Brands with approval workflow ───────────────────────────────────────────
export interface AdminBrand {
  id:              string;
  fullName:        string | null;
  handle:          string | null;
  city:            string | null;
  createdAt:       string;
  brandStatus:     string;
  taxDocumentUrl:  string | null;
  rejectionReason: string | null;
  accountStatus:   string;
  blockReason:     string | null;
}

export async function fetchAdminBrands(): Promise<AdminBrand[]> {
  const { data } = await adminClient
    .from("profiles")
    .select(`
      id, full_name, handle, city, created_at,
      brand_status, tax_document_url, brand_rejection_reason,
      account_status, block_reason
    `)
    .eq("role", "brand")
    .order("created_at", { ascending: false });

  return (data ?? []).map((b) => ({
    id:              b.id,
    fullName:        b.full_name,
    handle:          b.handle,
    city:            b.city,
    createdAt:       b.created_at,
    brandStatus:     (b as Record<string, unknown>).brand_status           as string ?? "approved",
    taxDocumentUrl:  (b as Record<string, unknown>).tax_document_url       as string ?? null,
    rejectionReason: (b as Record<string, unknown>).brand_rejection_reason as string ?? null,
    accountStatus:   (b as Record<string, unknown>).account_status         as string ?? "active",
    blockReason:     (b as Record<string, unknown>).block_reason           as string ?? null,
  }));
}
