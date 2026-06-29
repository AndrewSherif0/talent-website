import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

export async function GET() {
  // What roles actually exist in the DB?
  const { data: allProfiles } = await adminClient
    .from("profiles")
    .select("role, id, handle")
    .limit(100);

  const roleCounts: Record<string, number> = {};
  for (const p of allProfiles ?? []) {
    const r = String(p.role);
    roleCounts[r] = (roleCounts[r] ?? 0) + 1;
  }

  // Sample one profile of each role
  const samples: Record<string, unknown> = {};
  for (const p of allProfiles ?? []) {
    const r = String(p.role);
    if (!samples[r]) samples[r] = { handle: p.handle, id: p.id };
  }

  // Check talent_verifications count
  const { data: verifications, error: vErr } = await adminClient
    .from("talent_verifications")
    .select("id, status, talent_id");

  return NextResponse.json({
    role_counts:         roleCounts,
    role_samples:        samples,
    total_profiles:      allProfiles?.length ?? 0,
    total_verifications: verifications?.length ?? 0,
    verifications_error: vErr?.message ?? null,
    verifications_sample: verifications?.slice(0, 3),
  });
}
