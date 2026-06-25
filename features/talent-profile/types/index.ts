// ─── Raw DB shapes ───────────────────────────────────────────────────────────

export interface RawProfile {
  id: string;
  full_name: string | null;
  handle: string | null;
  avatar_url: string | null;
  city: string | null;
  bio: string | null;
  role: string;
  created_at: string;
  talent_profiles: RawTalentProfile | RawTalentProfile[] | null;
}

export interface RawTalentProfile {
  id: string;
  user_id: string;
  category: string | null;
  specialties: string[] | null;
  bio: string | null;
  availability: string | null;
  packages: unknown;
  social_links: Record<string, unknown> | null;
  profile_views: number | null;
  avg_rating: number | null;
  total_reviews: number | null;
  total_bookings: number | null;
}

export interface RawPortfolioItem {
  id: string;
  url: string | null;
  media_type: string;
  caption: string | null;
  sort_order: number;
  is_approved: boolean;
}

// ─── Domain types ─────────────────────────────────────────────────────────────

export interface CampaignStats {
  views: string;
  ctr: string;
  sales_increase: string;
  repeat: string;
}

export interface FeaturedCampaign {
  name: string;
  ctr_before: string;
  ctr_after: string;
  growth: string;
}

export interface PerformanceData {
  reach: string;
  engagement: string;
  impact: string;
  repeat_clients: string;
}

export interface ExperienceItem {
  name: string;
  year: string;
  verified: boolean;
}

export interface Review {
  id: number;
  author: string;
  brand: string;
  rating: number;
  text: string;
  date: string;
}

export interface BrandItem {
  id: number;
  name: string;
}

export interface PackageItem {
  id: string;
  name: string;
  price: string;
  popular: boolean;
  features: string[];
}

export interface PortfolioItem {
  id: string;
  url: string | null;
  media_type: string;
  caption: string | null;
  sort_order: number;
}

export interface TalentData {
  id: string;
  name: string;
  handle: string;
  title: string;
  location: string;
  memberSince: string;
  rating: number;
  reviewCount: number;
  views: string;
  verified: boolean;
  fastResponse: boolean;
  premium: boolean;
  bio?: string | null;
  specialties?: string[];
  category?: string | null;
}

// ─── Composite page data ──────────────────────────────────────────────────────

export interface TalentPageData {
  talent: TalentData;
  brands: BrandItem[];
  reviews: Review[];
  experience: ExperienceItem[] | null;
  packages: PackageItem[] | null;
  portfolioItems: PortfolioItem[];
  campaignStats: CampaignStats | null;
  featuredCampaign: FeaturedCampaign | null;
  performance: PerformanceData | null;
}
