import { createClient } from './supabase/client';

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const supabase = createClient();
  // signUp은 새 사용자를 auth.users에 생성하고 확인 이메일을 발송합니다.
  // Supabase 최신 버전에서는 onAuthStateChange가 auth 상태 변화를 자동으로 감지합니다.
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  // profiles 테이블에 프로필 데이터 생성
  // (onAuthStateChange가 감지하면 AuthContext에서도 upsert를 시도하지만,
  //  여기서 사전에 생성하여 중복을 방지합니다)
  if (result.data?.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([
        {
          id: result.data.user.id,
          username: name,
          role: 'user'
        }
      ], { onConflict: "id" });
    if (profileError) {
      console.error("Error creating profile during signup:", profileError);
    }
  }

  return result;
}

export async function signOut() {
  const supabase = createClient();
  return await supabase.auth.signOut();
}
