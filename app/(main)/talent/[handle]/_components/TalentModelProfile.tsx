"use client";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSite } from "@/contexts/SiteContext";
import type {
  TalentData,
  BrandItem,
  Review,
  ExperienceItem,
  PackageItem,
  PortfolioItem,
  CampaignStats,
  FeaturedCampaign,
  PerformanceData,
} from "@/features/talent-profile/types";
import CampaignBanner from "./CampaignBanner";
import ProfileHero from "./ProfileHero";
import TabsNavigation from "./TabsNavigation";
import PortfolioSection from "./PortfolioSection";
import ExperienceSection from "./ExperienceSection";
import PackagesSection from "./PackagesSection";
import UsageRightsSection from "./UsageRightsSection";
import PerformanceSidebar from "./PerformanceSidebar";
import ReviewsCard from "./ReviewsCard";
import BrandsCard from "./BrandsCard";
import TrustCard from "./TrustCard";
import BriefCard from "./BriefCard";
import QuestionCard from "./QuestionCard";
import StickyBookingBar from "./StickyBookingBar";

// Re-export types so existing sibling components can still import from here
// during incremental migration — remove once all imports point to features/
export type {
  TalentData,
  BrandItem,
  Review,
  ExperienceItem,
  PackageItem,
  PortfolioItem,
  CampaignStats,
  FeaturedCampaign,
  PerformanceData,
};

interface Props {
  talent: TalentData;
  brands: BrandItem[];
  reviews: Review[];
  experience?: ExperienceItem[] | null;
  packages?: PackageItem[] | null;
  portfolioItems?: PortfolioItem[];
  campaignStats?: CampaignStats | null;
  featuredCampaign?: FeaturedCampaign | null;
  performance?: PerformanceData | null;
}

export default function TalentModelProfile({
  talent,
  brands,
  reviews,
  experience,
  packages,
  portfolioItems,
  campaignStats,
  featuredCampaign,
  performance,
}: Props) {
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const isMobile = useIsMobile();
  const { dark } = useSite();

  return (
    <main
      dir="rtl"
      style={{
        fontFamily: "'Cairo', sans-serif",
        backgroundColor: dark ? "#050B12" : "#F1F5F9",
        minHeight: "100vh",
        paddingBottom: 110,
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 24px" }}>
        <CampaignBanner campaignStats={campaignStats} featuredCampaign={featuredCampaign} />
        <ProfileHero talent={talent} />
        <TabsNavigation talent={talent} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
            gap: 24,
            marginTop: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div id="section-about" />
            <div id="section-portfolio"><PortfolioSection portfolioItems={portfolioItems} /></div>
            <div id="section-experience"><ExperienceSection experience={experience} /></div>
            <div id="section-packages"><PackagesSection onSelect={setSelectedPackage} packages={packages} /></div>
            <div id="section-usage"><UsageRightsSection selectedPackage={selectedPackage} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <PerformanceSidebar performance={performance} />
            <ReviewsCard reviews={reviews} rating={talent.rating} />
            <BrandsCard brands={brands} />
            <TrustCard />
            <BriefCard />
            <QuestionCard />
          </div>
        </div>
      </div>
      <StickyBookingBar talent={talent} selectedPackage={selectedPackage} />
    </main>
  );
}
