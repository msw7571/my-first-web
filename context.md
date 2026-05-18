# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-05-18
- 완료된 작업: 홈 페이지, 헤더/푸터 레이아웃, 포스트 목록, 포스트 상세 페이지, Supabase 연동 (Ch8), Auth 인증 (Ch9 로그인/회원가입)
- 진행 중: 게시글 CRUD와 Auth 연동 (Ch10)
- 미착수: RLS 보안 (Ch11), 마이페이지/댓글 (Ch12)

## 기술 결정 사항

- 인증: Supabase Auth (Email)
- 상태관리: React Context (AuthProvider - Ch9)
- 데이터베이스 접근: `lib/supabase/client.ts` (Ch8)
- 프론트엔드 라우팅: Next.js App Router 전용 (`next/router` 사용 금지)
- 권한 제어(UI): 수정/삭제 버튼은 프론트엔드 UX 차원에서 로그인한 사용자/작성자에게만 노출 (실제 보안은 추후 Ch11 RLS로)

## 해결된 이슈

- shadcn/ui Button variant가 디자인 토큰과 불일치 → globals.css의 --primary 수정으로 해결
- 모바일 헤더 메뉴가 겹침 → Sheet 컴포넌트로 교체
- 인증된 사용자 정보 연동 및 보호 라우트 처리 (Ch9 완료)

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → `next/navigation`의 redirect() 사용
- 교재 패키지 버전(Supabase-js 2.47.12)과 현재 설치 버전(^2.105.1)에 차이가 있으나, 현재 설치된 최신 버전을 유지하면서 코드는 교재 기준으로 작성함.