import { adminClient } from "@/lib/supabase/admin";
import type { RawProfile, RawPortfolioItem, BrandItem, RawReview, BookingStats } from "../types";

export async function fetchTalentByHandle(handle: string): Promise<RawProfile | null> {
  const { data, error } = await adminClient
    .from("profiles")
    .select("*, talent_profiles(id,user_id,category,specialties,bio,availability,packages,social_links,profile_views,avg_rating,total_reviews,total_bookings,is_featured)")
    .eq("handle", handle)
    .single();

  if (error || !data) return null;
  return data as RawProfile;
}

export async function fetchPortfolioByTalentId(talentProfileId: string): Promise<RawPortfolioItem[]> {
  const { data } = await adminClient
    .from("portfolio_items")
    .select("id, url, media_type, caption, sort_order, is_approved")
    .eq("talent_id", talentProfileId)
    .order("sort_order", { ascending: true });

  return (data ?? []) as RawPortfolioItem[];
}

export async function fetchReviewsByTalentId(talentProfileId: string): Promise<RawReview[]> {
  const { data } = await adminClient
    .from("reviews")
    .select("id, booking_id, talent_id, brand_id, rating, comment, created_at, profiles(full_name)")
    .eq("talent_id", talentProfileId)
    .order("created_at", { ascending: false });

  return (data ?? []) as RawReview[];
}

export async function fetchBookingStatsByTalentId(talentProfileId: string): Promise<BookingStats> {
  const { data } = await adminClient
    .from("bookings")
    .select("status")
    .eq("talent_id", talentProfileId);

  const rows = data ?? [];
  return {
    total:     rows.length,
    completed: rows.filter(r => r.status === "completed").length,
    pending:   rows.filter(r => r.status === "pending").length,
    cancelled: rows.filter(r => r.status === "cancelled").length,
  };
}

export async function fetchBrandsByTalentProfileId(talentProfileId: string): Promise<BrandItem[]> {
  const { data } = await adminClient
    .from("talent_brands")
    .select("id, brand_name, logo_url, year_collaborated, sort_order")
    .eq("talent_profile_id", talentProfileId)
    .order("sort_order", { ascending: true });

  if (!data?.length) return [];
  return data.map((row) => ({
    id: row.id,
    name: row.brand_name,
    logo_url: row.logo_url ?? null,
    year_collaborated: row.year_collaborated ?? null,
    sort_order: row.sort_order ?? 0,
  }));
}
