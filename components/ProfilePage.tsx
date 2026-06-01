"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | {
    id: string;
    email: string | null;
    created_at: string | null;
  }>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("세션 확인 중 오류:", sessionError);
        }

        if (!sessionData?.session) {
          router.replace("/login");
          return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("사용자 정보를 가져오는 중 오류:", userError);
          setErrorMessage("사용자 정보를 불러오는 중 오류가 발생했습니다.");
          return;
        }

        const currentUser = userData?.user;
        if (!currentUser) {
          router.replace("/login");
          return;
        }

        setUser({
          id: currentUser.id,
          email: currentUser.email,
          created_at: currentUser.created_at ?? null,
        });
      } catch (error: any) {
        console.error("프로필 로딩 예외:", error);
        setErrorMessage("사용자 정보를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("로그아웃 오류:", error);
      setErrorMessage("로그아웃 중 오류가 발생했습니다. 다시 시도해 주세요.");
      return;
    }
    router.replace("/login");
  };

  const formattedDate = user?.created_at
    ? new Date(user.created_at)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\s/g, "")
        .replace(/\.$/, "")
    : "정보 없음";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm w-full max-w-lg">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-3/5 rounded-full bg-gray-200"></div>
            <div className="space-y-4">
              <div className="h-6 w-full rounded-full bg-gray-200"></div>
              <div className="h-6 w-full rounded-full bg-gray-200"></div>
              <div className="h-6 w-4/5 rounded-full bg-gray-200"></div>
            </div>
            <div className="h-12 w-32 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-10">
      <Card className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl">내 프로필</CardTitle>
          <CardDescription>회원님의 계정 정보를 안전하게 확인할 수 있습니다.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">이메일</p>
                <p className="text-base font-semibold text-gray-900">{user?.email ?? "정보 없음"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">고유 ID</p>
                <p className="break-all text-base font-semibold text-gray-900">{user?.id ?? "정보 없음"}</p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">가입일</p>
                <p className="text-base font-semibold text-gray-900">{formattedDate}</p>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.replace("/")}>메인으로 이동</Button>
            <Button className="w-full sm:w-auto" onClick={handleSignOut}>로그아웃</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
