export const dynamic = "force-dynamic";

import { adminClient } from "@/lib/supabase/admin";
import AdminBrandsClient from "./_components/AdminBrandsClient";

export default async function AdminBrandsPage() {
  const { data } = await adminClient
    .from("profiles")
    .select("id, full_name, handle, avatar_url, city, created_at")
    .eq("role", "brand")
    .order("created_at", { ascending: false });

  return <AdminBrandsClient brands={data ?? []} />;
}
