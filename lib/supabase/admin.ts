import { createClient } from "@supabase/supabase-js";

// Usage in Server only (bypasses RLS):
// import { adminClient } from "@/lib/supabase/admin";

export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
