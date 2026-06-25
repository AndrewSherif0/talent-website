import type {
  RawProfile,
  RawTalentProfile,
  RawPortfolioItem,
  TalentPageData,
  TalentData,
  CampaignStats,
  FeaturedCampaign,
  PerformanceData,
  ExperienceItem,
  Review,
  BrandItem,
  PackageItem,
  PortfolioItem,
} from "../types";

// ─── Fallback defaults ────────────────────────────────────────────────────────

const DEFAULT_BRANDS: BrandItem[] = [
  { id: 1, name: "Noon" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "H&M" },
  { id: 4, name: "L'Oréal" },
  { id: 5, name: "Adidas" },
  { id: 6, name: "Shein" },
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 1,
    author: "أحمد الشامي",
    brand: "Noon",
    rating: 5,
    text: "تعاون رائع! أبدعت في تصوير حملتنا وزادت مبيعاتنا بشكل ملحوظ.",
    date: "مارس 2024",
  },
];

// ─── Individual field transformers ────────────────────────────────────────────

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${Math.round(views / 1_000)}K`;
  return String(views);
}

function transformTalentData(profile: RawProfile, tp: RawTalentProfile | null, sl: Record<string, unknown>): TalentData {
  return {
    id: profile.id,
    name: profile.full_name ?? "Talent",
    handle: profile.handle ?? "",
    title: (sl.title as string) ?? "Gold Model",
    location: profile.city ? `${profile.city}، مصر` : "القاهرة، مصر",
    memberSince: (sl.member_since as string) ?? profile.created_at?.slice(0, 4) ?? "2022",
    rating: tp?.avg_rating ?? 4.9,
    reviewCount: tp?.total_reviews ?? 0,
    views: (sl.views_display as string) ?? formatViews(tp?.profile_views ?? 0),
    verified: Boolean(sl.verified),
    fastResponse: Boolean(sl.fast_response),
    premium: Boolean(sl.premium),
    bio: profile.bio ?? tp?.bio ?? null,
    specialties: tp?.specialties ?? [],
    category: tp?.category ?? null,
  };
}

function transformBrands(sl: Record<string, unknown>): BrandItem[] {
  if (!Array.isArray(sl.brands) || sl.brands.length === 0) return DEFAULT_BRANDS;
  return (sl.brands as string[]).map((name, i) => ({ id: i + 1, name }));
}

function transformReviews(sl: Record<string, unknown>): Review[] {
  if (!Array.isArray(sl.reviews) || sl.reviews.length === 0) return DEFAULT_REVIEWS;
  return (sl.reviews as Array<Record<string, unknown>>).map((r, i) => ({
    id: i + 1,
    author: String(r.author ?? ""),
    brand: String(r.brand ?? ""),
    rating: Number(r.rating ?? 5),
    text: String(r.text ?? ""),
    date: String(r.date ?? ""),
  }));
}

function transformExperience(sl: Record<string, unknown>): ExperienceItem[] | null {
  if (!Array.isArray(sl.experience)) return null;
  return (sl.experience as Array<Record<string, unknown>>).map((e) => ({
    name: String(e.name ?? ""),
    year: String(e.year ?? ""),
    verified: Boolean(e.verified),
  }));
}

function transformPackages(raw: unknown): PackageItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const parsed: PackageItem[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (!r.id || !r.name || !r.price) continue;
    parsed.push({
      id: String(r.id),
      name: String(r.name),
      price: String(r.price),
      popular: Boolean(r.popular),
      features: Array.isArray(r.features) ? r.features.map(String) : [],
    });
  }
  return parsed.length > 0 ? parsed : null;
}

function transformCampaignStats(sl: Record<string, unknown>): CampaignStats | null {
  const raw = sl.campaign_stats as Record<string, string> | undefined;
  if (!raw) return null;
  return {
    views: raw.views ?? "—",
    ctr: raw.ctr ?? "—",
    sales_increase: raw.sales_increase ?? "—",
    repeat: raw.repeat ?? "—",
  };
}

function transformFeaturedCampaign(sl: Record<string, unknown>): FeaturedCampaign | null {
  const raw = sl.featured_campaign as Record<string, string> | undefined;
  if (!raw) return null;
  return {
    name: raw.name ?? "—",
    ctr_before: raw.ctr_before ?? "—",
    ctr_after: raw.ctr_after ?? "—",
    growth: raw.growth ?? "—",
  };
}

function transformPerformance(sl: Record<string, unknown>): PerformanceData | null {
  const raw = sl.performance as Record<string, string> | undefined;
  if (!raw) return null;
  return {
    reach: raw.reach ?? "—",
    engagement: raw.engagement ?? "—",
    impact: raw.impact ?? "—",
    repeat_clients: raw.repeat_clients ?? "—",
  };
}

function transformPortfolioItems(raw: RawPortfolioItem[]): PortfolioItem[] {
  return raw.map((item) => ({
    id: item.id,
    url: item.url,
    media_type: item.media_type,
    caption: item.caption,
    sort_order: item.sort_order,
  }));
}

// ─── Main transformer ─────────────────────────────────────────────────────────

export function transformTalentPageData(
  profile: RawProfile,
  tp: RawTalentProfile | null,
  rawPortfolio: RawPortfolioItem[]
): TalentPageData {
  const sl = (tp?.social_links ?? {}) as Record<string, unknown>;

  return {
    talent: transformTalentData(profile, tp, sl),
    brands: transformBrands(sl),
    reviews: transformReviews(sl),
    experience: transformExperience(sl),
    packages: transformPackages(tp?.packages),
    portfolioItems: transformPortfolioItems(rawPortfolio),
    campaignStats: transformCampaignStats(sl),
    featuredCampaign: transformFeaturedCampaign(sl),
    performance: transformPerformance(sl),
  };
}
