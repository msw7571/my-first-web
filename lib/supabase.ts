import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
};

const getSupabaseKey = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

const ensureSupabaseEnv = () => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseKey();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase environment variables are required. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return { supabaseUrl, supabaseKey };
};

export const getSupabaseClient = (): SupabaseClient => {
  const { supabaseUrl, supabaseKey } = ensureSupabaseEnv();
  return createClient(supabaseUrl, supabaseKey);
};
