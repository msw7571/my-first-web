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
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (result.data?.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: result.data.user.id,
          username: name,
          role: 'user'
        }
      ]);
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
