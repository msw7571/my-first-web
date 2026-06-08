import { createClient } from "@supabase/supabase-js";

// 클라이언트용 Supabase 인스턴스
// 환경변수: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!url || !anonKey) {
  // 런타임에서 환경변수가 없으면 명확한 에러를 남깁니다.
  // 배포 환경에서는 반드시 NEXT_PUBLIC_* 변수들을 설정하세요.
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set."
  );
}

export const supabase = createClient(url, anonKey);

export default supabase;
