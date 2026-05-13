"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          내 블로그
        </Link>
        
        <div className="flex items-center space-x-4">
          {loading ? (
            <span className="text-sm text-gray-400">상태 확인 중...</span>
          ) : user ? (
            <>
              <Link href="/posts/new" className="text-sm hover:underline">
                새 글 쓰기
              </Link>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:underline">
                로그인
              </Link>
              <Link href="/signup" className="text-sm hover:underline">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
