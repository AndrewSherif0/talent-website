import { adminClient } from "@/lib/supabase/admin";
import type { RawProfile, RawPortfolioItem } from "../types";

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
