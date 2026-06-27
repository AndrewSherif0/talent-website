import { adminClient } from "@/lib/supabase/admin";
import type { RawProfile, RawPortfolioItem, BrandItem } from "../types";

export async function fetchTalentByHandle(handle: string): Promise<RawProfile | null> {
  const { data, error } = await adminClient
    .from("profiles")
    .select("*, talent_profiles(*)")
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
