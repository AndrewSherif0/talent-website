import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { data, error } = await adminClient
    .from("profiles")
    .select("id, handle, full_name, role, is_approved")
    .eq("role", "brand");

  return NextResponse.json({ count: data?.length ?? 0, error: error?.message, brands: data?.slice(0, 5) });
}
