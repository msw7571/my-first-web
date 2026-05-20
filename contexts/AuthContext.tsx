"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signInWithEmail, signUpWithEmail, signOut } from "@/lib/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithEmail: typeof signInWithEmail;
  signUpWithEmail: typeof signUpWithEmail;
  signOut: typeof signOut;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // 앱 시작 시 현재 사용자 상태 확인
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          // Ensure profile exists on the fly
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

          if (!profile) {
            await supabase.from("profiles").insert([
              {
                id: user.id,
                username: user.user_metadata?.name || user.email?.split("@")[0] || "사용자",
                role: "user"
              }
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // 로그인/로그아웃 등 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Ensure profile exists on the fly
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (!profile) {
          await supabase.from("profiles").insert([
            {
              id: currentUser.id,
              username: currentUser.user_metadata?.name || currentUser.email?.split("@")[0] || "사용자",
              role: "user"
            }
          ]);
        }
      }
    });

    // cleanup 함수에서 반드시 구독 해제
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
