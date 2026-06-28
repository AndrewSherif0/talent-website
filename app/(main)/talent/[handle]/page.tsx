export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import {
  fetchTalentByHandle,
  fetchPortfolioByTalentId,
  fetchReviewsByTalentId,
  fetchBookingStatsByTalentId,
} from "@/features/talent-profile/services/talent-profile.service";
import { transformTalentPageData } from "@/features/talent-profile/transformers/talent-profile.transformer";
import TalentModelProfile from "./_components/TalentModelProfile";

export default async function TalentPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const profile = await fetchTalentByHandle(handle);
  if (!profile) notFound();

  const tp = Array.isArray(profile.talent_profiles)
    ? profile.talent_profiles[0]
    : profile.talent_profiles;

  const [rawPortfolio, rawReviews, bookingStats] = await Promise.all([
    tp?.id ? fetchPortfolioByTalentId(tp.id)      : Promise.resolve([]),
    tp?.id ? fetchReviewsByTalentId(tp.id)         : Promise.resolve([]),
    tp?.id ? fetchBookingStatsByTalentId(tp.id)    : Promise.resolve({ total: 0, completed: 0, pending: 0, cancelled: 0 }),
  ]);

  const data = transformTalentPageData(profile, tp ?? null, rawPortfolio, rawReviews);

  return (
    <TalentModelProfile
      talent={data.talent}
      brands={data.brands}
      reviews={data.reviews}
      experience={data.experience}
      packages={data.packages}
      addons={data.addons}
      portfolioItems={data.portfolioItems}
      campaignStats={data.campaignStats}
      featuredCampaign={data.featuredCampaign}
      bookingStats={bookingStats}
    />
  );
}
