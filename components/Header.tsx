"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/DarkModeToggle";

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
    <nav className="sticky top-0 z-50 bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-700 dark:border-slate-800 shadow-lg transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* 좌측: 로고 */}
        <Link 
          href="/posts" 
          className="text-xl font-bold text-white hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            📝
          </span>
          내 블로그
        </Link>
        
        {/* 우측: 메뉴 및 기능 */}
        <div className="flex items-center gap-6">
          {/* 다크모드 토글 */}
          <DarkModeToggle />

          {/* 로딩 중 표시 */}
          {loading ? (
            <span className="text-sm text-slate-400">상태 확인 중...</span>
          ) : user ? (
            // 로그인 상태
            <div className="flex items-center gap-4">
              {/* [포스트] 버튼 */}
              <Link 
                href="/posts"
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-slate-800 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                포스트
              </Link>

              {/* [내 프로필] 버튼 */}
              <Link 
                href="/mypage"
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-slate-800 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                내 프로필
              </Link>

              {/* 로그아웃 버튼 */}
              <Button 
                variant="secondary" 
                size="sm"
                className="text-slate-900 dark:text-white hover:bg-red-500 dark:hover:bg-red-600 transition-all duration-200"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </div>
          ) : (
            // 비로그인 상태
            <div className="flex items-center gap-4">
              {/* [로그인] 버튼 */}
              <Link 
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-slate-800 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                로그인
              </Link>

              {/* [회원가입] 버튼 */}
              <Link 
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
