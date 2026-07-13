import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

// POST /api/jobs/[id]/apply
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: jobId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Only talents can apply
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["talent", "freelancer", "ugc"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    return NextResponse.json({ error: "only talents can apply" }, { status: 403 });
  }

  // Check job exists and is open
  const { data: job } = await adminClient
    .from("jobs")
    .select("id, status, brand_id")
    .eq("id", jobId)
    .single();

  if (!job) return NextResponse.json({ error: "job not found" }, { status: 404 });
  if (job.status !== "open") return NextResponse.json({ error: "job is not open" }, { status: 400 });

  // Prevent self-apply (brand applying to own job shouldn't happen, but safety check)
  if (job.brand_id === user.id) {
    return NextResponse.json({ error: "cannot apply to your own job" }, { status: 400 });
  }

  // Check for duplicate application
  const { data: existing } = await adminClient
    .from("job_applications")
    .select("id, status")
    .eq("job_id", jobId)
    .eq("talent_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ application: existing, already_applied: true });
  }

  const { cover_letter } = await req.json().catch(() => ({ cover_letter: null }));

  const { data: application, error } = await adminClient
    .from("job_applications")
    .insert({
      job_id: jobId,
      talent_id: user.id,
      cover_letter: cover_letter ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ application }, { status: 201 });
}

// GET /api/jobs/[id]/apply — check if current user already applied
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: jobId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ applied: false });

  const { data } = await adminClient
    .from("job_applications")
    .select("id, status")
    .eq("job_id", jobId)
    .eq("talent_id", user.id)
    .maybeSingle();

  return NextResponse.json({ applied: !!data, application: data ?? null });
}
