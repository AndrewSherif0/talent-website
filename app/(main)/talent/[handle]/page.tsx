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

  // Fetch profile + talent_profile joined
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      id, full_name, handle, city, avatar_url, bio,
      talent_profiles (
        id, category, specialties, availability,
        avg_rating, total_reviews, total_bookings,
        profile_views, social_links, packages, is_featured,
        portfolio_items (
          id, url, media_type, caption, sort_order
        )
      )
    `)
    .eq("handle", handle)
    .eq("role", "talent")
    .eq("is_approved", true)
    .single();

  // Fallback mock data for development when DB is empty
  if (!profile || !profile.talent_profiles) {
    const mockTalent = {
      id: "mock-1", name: "Maya Khaled", handle, city: "Cairo, Egypt",
      avatar_url: null, bio: "موديل محترفة متخصصة في Fashion & Commercial",
      category: "Model", specialties: ["Fashion", "Commercial", "Lifestyle"],
      availability: "available", avg_rating: 4.9, total_reviews: 86,
      total_bookings: 18, profile_views: 18000, social_links: {
        instagram_followers: "18.4K", tiktok_followers: "12.1K",
        youtube_followers: "6.2K", linkedin_followers: "2.3K",
      },
      packages: [
        { icon: "🚀", name: "Starter", price: "1,500", currency: "EGP", desc: "لـ جلسة تصوير", features: ["حتى 30 صورة", "1 تعديل", "التسليم: 3 أيام"] },
        { icon: "⭐", name: "Growth",  price: "4,000", currency: "EGP", desc: "لـ 3 جلسات", features: ["حتى 1 لوك/ستايل", "2 تعديل", "التسليم: 5 أيام"], is_popular: true },
        { icon: "👑", name: "Premium", price: "7,000", currency: "EGP", desc: "جلسات + فيديو", features: ["حتى 5 لوك/ستايل", "3 تعديل", "التسليم: 7 أيام"] },
      ],
      is_featured: true, portfolio: [], talent_profile_id: "mock-tp-1",
    };
    return <TalentProfileClient talent={mockTalent} brands={[]} reviews={[]} />;
  }

  const tp = Array.isArray(profile.talent_profiles)
    ? profile.talent_profiles[0]
    : profile.talent_profiles;

  // Brands worked with: bookings → client_profiles → profiles
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
    .filter(
      (v: any, i: number, arr: any[]) =>
        arr.findIndex((x) => x.full_name === v.full_name) === i
    );

  // Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id, rating, comment, created_at,
      profiles!reviews_reviewer_id_fkey (full_name, avatar_url)
    `)
    .eq("target_id", profile.id)
    .eq("is_public", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(3);

  const talent = {
    id:            profile.id,
    name:          profile.full_name,
    handle:        profile.handle,
    city:          profile.city,
    avatar_url:    profile.avatar_url,
    bio:           profile.bio ?? tp.bio,
    category:      tp.category,
    specialties:   tp.specialties ?? [],
    availability:  tp.availability,
    avg_rating:    tp.avg_rating ?? 0,
    total_reviews: tp.total_reviews ?? 0,
    total_bookings:tp.total_bookings ?? 0,
    profile_views: tp.profile_views ?? 0,
    social_links:  tp.social_links ?? {},
    packages:      tp.packages ?? [],
    is_featured:   tp.is_featured,
    portfolio:     tp.portfolio_items ?? [],
    talent_profile_id: tp.id,
  };

  return (
    <TalentProfileClient
      talent={talent}
      brands={brands}
      reviews={reviews ?? []}
    />
  );
}
