import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 응답 객체 초기화
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // request 쿠키 갱신
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // 갱신된 request로 응답 객체 재생성
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // 응답 객체에 쿠키 적용
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 중요: createServerClient와 getUser() 사이에 다른 로직을 작성하지 마세요.
  // 안전하게 현재 사용자 세션을 가져오고 쿠키를 갱신합니다.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 보호해야 할 라우트 지정 (/posts/new)
  // (참고: /mypage 라우트는 아직 프로젝트에 구현되지 않아 조건에서 제외했습니다.)
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/posts/new')

  // 보호 라우트인데 로그인 상태가 아니라면 /login으로 리다이렉트
  if (isProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 경로를 제외한 모든 요청에 미들웨어 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘)
     * - 이미지 포맷 확장자들
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
