import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import { SiteProvider } from "@/contexts/SiteContext";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  let initialAvatarUrl: string | null = null;
  let initialFullName: string | null = null;

  if (session?.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url, full_name")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profile) {
      initialAvatarUrl = profile.avatar_url;
      initialFullName = profile.full_name;
    }
  }

  return (
    <SiteProvider>
      <Navbar initialAvatarUrl={initialAvatarUrl} initialFullName={initialFullName} />
      <main style={{ }}>{children}</main>
    </SiteProvider>
  );
}
