import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createAdminSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY와 NEXT_PUBLIC_SUPABASE_URL 환경 변수를 모두 설정해야 합니다."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
}
