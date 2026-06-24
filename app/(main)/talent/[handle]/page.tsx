import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TalentProfileClient from "./_components/TalentProfileClient";

export default async function TalentProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();

  // ── 1. Profile + talent_profile + portfolio
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      id, full_name, handle, city, avatar_url, bio,
      talent_profiles (
        id, category, specialties, availability, bio,
        avg_rating, total_reviews, total_bookings, profile_views,
        social_links, packages, is_featured,
        portfolio_items (
          id, url, media_type, caption, sort_order, is_approved
        )
      )
    `)
    .eq("handle", handle)
    .eq("role", "talent")
    .eq("is_approved", true)
    .single();

  if (!profile || !profile.talent_profiles) notFound();

  const tp = Array.isArray(profile.talent_profiles)
    ? profile.talent_profiles[0]
    : profile.talent_profiles;

  // ── 2. Brands worked with (bookings → client → profile)
  const { data: brandsRaw } = await supabase
    .from("bookings")
    .select(`
      client_profiles!bookings_client_id_fkey (
        profiles!client_profiles_user_id_fkey (
          full_name, avatar_url
        )
      )
    `)
    .eq("talent_id", tp.id)
    .eq("status", "completed")
    .limit(6);

  const brands = (brandsRaw ?? [])
    .map((b: any) => b.client_profiles?.profiles)
    .filter(Boolean)
    .filter((v: any, i: number, arr: any[]) =>
      arr.findIndex((x) => x.full_name === v.full_name) === i
    );

  // ── 3. Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id, rating, comment, created_at,
      profiles!reviews_reviewer_id_fkey ( full_name, avatar_url )
    `)
    .eq("target_id", profile.id)
    .eq("is_public", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(3);

  // ── 4. Top completed booking (for top campaign card)
  const { data: topBooking } = await supabase
    .from("bookings")
    .select(`
      id, job_type, fee, completed_at,
      client_profiles!bookings_client_id_fkey (
        profiles!client_profiles_user_id_fkey ( full_name, avatar_url )
      )
    `)
    .eq("talent_id", tp.id)
    .eq("status", "completed")
    .order("fee", { ascending: false })
    .limit(1)
    .maybeSingle();

  // ── Compose talent object
  const talent = {
    id:             profile.id,
    name:           profile.full_name,
    handle:         profile.handle,
    city:           profile.city,
    avatar_url:     profile.avatar_url,
    bio:            profile.bio ?? tp.bio,
    category:       tp.category,
    specialties:    tp.specialties ?? [],
    availability:   tp.availability,
    avg_rating:     Number(tp.avg_rating  ?? 0),
    total_reviews:  Number(tp.total_reviews  ?? 0),
    total_bookings: Number(tp.total_bookings ?? 0),
    profile_views:  Number(tp.profile_views  ?? 0),
    social_links:   (tp.social_links  as Record<string, string>) ?? {},
    packages:       (tp.packages as any[]) ?? [],
    is_featured:    tp.is_featured ?? false,
    portfolio:      (tp.portfolio_items as any[]) ?? [],
    talent_profile_id: tp.id,
  };

  return (
    <TalentProfileClient
      talent={talent}
      brands={brands}
      reviews={reviews ?? []}
      topBooking={topBooking}
    />
  );
}
