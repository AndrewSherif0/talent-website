import { adminClient } from "@/lib/supabase/admin";
import type { AdminTalent, AdminDashboardStats, AdminBooking, AdminReview } from "../types";

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [talentsRes, brandsRes, bookingsRes, reviewsRes] = await Promise.all([
    adminClient.from("talent_profiles").select("id"),
    adminClient.from("profiles").select("id").eq("role", "brand"),
    adminClient.from("bookings").select("id"),
    adminClient.from("reviews").select("id"),
  ]);

  const totalTalents = (talentsRes.data ?? []).length;
  return {
    pending:   0,
    approved:  totalTalents,
    rejected:  0,
    suspended: 0,
    brands:    (brandsRes.data ?? []).length,
    bookings:  (bookingsRes.data ?? []).length,
    reviews:   (reviewsRes.data ?? []).length,
  };
}

export async function fetchAdminTalents(statusFilter?: string): Promise<AdminTalent[]> {
  let query = adminClient
    .from("profiles")
    .select(`
      id, handle, full_name, avatar_url, city, created_at,
      talent_profiles (
        id, category, avg_rating, total_reviews
      )
    `)
    .eq("role", "talent")
    .order("created_at", { ascending: false });

  const { data } = await query;

  return (data ?? []).flatMap((p) => {
    const tp = Array.isArray(p.talent_profiles) ? p.talent_profiles[0] : p.talent_profiles;
    if (!tp) return [];

    const status: AdminTalent["status"] = "approved"; // temporary until migration runs
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
      avgRating:       tp.avg_rating ?? null,
      totalReviews:    tp.total_reviews ?? null,
    }];
  });
}

export async function fetchAdminBookings(): Promise<AdminBooking[]> {
  const { data } = await adminClient
    .from("bookings")
    .select(`
      id, status, created_at,
      brand:brand_id ( full_name, handle ),
      talent:talent_id ( full_name, handle )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  return (data ?? []) as AdminBooking[];
}

export async function fetchAdminReviews(): Promise<AdminReview[]> {
  const { data } = await adminClient
    .from("reviews")
    .select(`
      id, rating, comment, created_at,
      brand:brand_id ( full_name ),
      talent:talent_id ( full_name, handle )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  return (data ?? []) as AdminReview[];
}
