export const dynamic = "force-dynamic";

import { fetchAdminTalents } from "@/features/admin/services/admin.service";
import AdminShell from "@/components/admin/AdminShell";
import TalentsTableClient from "../talents/_components/TalentsTableClient";

export default async function AdminVerificationsPage() {
  // Verifications shows only pending talents
  const talents = await fetchAdminTalents("pending");
  return <TalentsTableClient talents={talents} />;
}
