"use client";
import { useState } from "react";
import PerformanceSnapshot  from "./main/PerformanceSnapshot";
import TalentHeader         from "./main/TalentHeader";
import ProfileTabs         from "./main/ProfileTabs";
import Portfolio           from "./main/Portfolio";
import PackagesSection     from "./main/PackagesSection";
import AboutSidebar        from "./sidebar/AboutSidebar";
import AvailabilitySidebar from "./sidebar/AvailabilitySidebar";
import SocialProof         from "./sidebar/SocialProof";
import ReviewsSidebar      from "./sidebar/ReviewsSidebar";
import BrandsSidebar       from "./sidebar/BrandsSidebar";
import AskTalent           from "./sidebar/AskTalent";

export default function TalentProfileClient({ talent, brands, reviews, topBooking }: {
  talent:     any;
  brands:     any[];
  reviews:    any[];
  topBooking: any;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>

      {/* Breadcrumb */}
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
        الرئيسية › {talent.category} › {talent.name}
      </p>

      {/* Performance */}
      <PerformanceSnapshot
        profileViews={talent.profile_views}
        avgRating={talent.avg_rating}
        totalBookings={talent.total_bookings}
        totalReviews={talent.total_reviews}
        topBooking={topBooking}
      />

      {/* 2-col layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "16px", alignItems: "start" }}>

        {/* ── MAIN ── */}
        <div>
          <TalentHeader talent={talent} />
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {(activeTab === "overview" || activeTab === "portfolio") && (
            <Portfolio items={talent.portfolio} />
          )}
          {(activeTab === "overview" || activeTab === "packages") && (
            <PackagesSection packages={talent.packages} />
          )}
          {["shoots", "verified", "reviews"].includes(activeTab) && (
            <div style={{
              backgroundColor: "var(--bg-card)", border: "1px solid var(--bg-border)",
              borderRadius: "12px", padding: "40px",
              textAlign: "center", color: "var(--text-muted)", fontSize: "14px",
            }}>
              قريباً...
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div style={{ position: "sticky", top: "76px" }}>
          <AvailabilitySidebar availability={talent.availability} />
          <AboutSidebar talent={talent} />
          <SocialProof socialLinks={talent.social_links} />
          <ReviewsSidebar
            reviews={reviews}
            avgRating={talent.avg_rating}
            totalReviews={talent.total_reviews}
          />
          <BrandsSidebar brands={brands} />
          <AskTalent name={talent.name.split(" ")[0]} />
        </div>
      </div>
    </div>
  );
}
