import type { TalentStatus } from "@/features/talent-profile/types";

export type { TalentStatus };

export interface AdminTalent {
  profileId: string;
  talentProfileId: string;
  fullName: string | null;
  handle: string | null;
  avatarUrl: string | null;
  category: string | null;
  city: string | null;
  createdAt: string;
  status: TalentStatus;
  approvedAt: string | null;
  rejectionReason: string | null;
  avgRating: number | null;
  totalReviews: number | null;
}

export interface AdminDashboardStats {
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
  brands: number;
  bookings: number;
  reviews: number;
}

export interface AdminBooking {
  id: string;
  status: string;
  created_at: string;
  brand: { full_name: string | null; handle: string | null } | { full_name: string | null; handle: string | null }[] | null;
  talent: { full_name: string | null; handle: string | null } | { full_name: string | null; handle: string | null }[] | null;
}

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  brand: { full_name: string | null } | { full_name: string | null }[] | null;
  talent: { full_name: string | null; handle: string | null } | { full_name: string | null; handle: string | null }[] | null;
}
