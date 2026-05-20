## Tech Stack

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui (components/ui/ 경로에 설치됨)

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치 기준: Next.js 16.2.1, @supabase/supabase-js ^2.105.1, @supabase/ssr ^0.10.2
- 실제 package.json이 교재 기준보다 최신이므로, 이를 삭제하지 않고 유지한다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json (현재 설치 기준)을 바탕으로 원인을 확인한다.

## Supabase Auth Rules (Ch9)

- Ch8 환경변수 이름을 유지한다: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 이메일/비밀번호 인증만 사용한다. 소셜 로그인은 추가하지 않는다.
- 보호 라우트 파일로 `middleware.ts`를 사용한다.
- Supabase Auth 로그인은 `signInWithPassword`를 사용한다. 구버전 `auth.signIn()`은 사용하지 않는다.
- `service_role` 키는 클라이언트에 절대 두지 않는다.

## Post CRUD Rules (Ch10)

- Ch7·Ch8 교재 기준 패키지를 따른다.
- 데이터베이스 접근 시 Ch8의 `lib/supabase/client.ts`를 사용한다.
- 로그인한 사용자 정보는 Ch9의 `useAuth` / `AuthProvider`를 사용해 가져온다.
- `posts` 테이블의 컬럼명은 Ch8 스키마를 그대로 사용한다 (id, user_id, title, content, created_at).
- `posts` 테이블의 id는 uuid이며, user_id는 profiles 테이블을 참조한다.
- App Router만 사용하며, `next/router` 사용은 엄격히 금지한다.
- 게시글 수정/삭제 UI 노출 여부는 프론트엔드 UX 차원에서의 처리이며, 실제 보안 및 권한 검증은 Ch11 RLS(Row Level Security)에서 처리한다.

## Supabase RLS Rules (Ch11)

- RLS는 SQL Editor 직접 실행이 아니라 Supabase CLI 마이그레이션으로 남긴다. (`supabase/migrations` 디렉토리 내에 버전이 지정된 sql 파일 생성)
- `posts` 테이블의 `user_id`와 `auth.uid()`를 기준으로 정책을 만든다.
- 클라이언트 UI 분기(본인 확인 후 수정/삭제 버튼 노출 등)는 프론트엔드 UX/DX 개선용일 뿐 보안이 아니며, 실제 데이터 보호 및 보안 검증은 데이터베이스 레벨의 RLS가 담당한다.
- `service_role` 키는 클라이언트(브라우저)에서 절대 사용하지 않으며, 오직 안전한 서버 환경(서버 컴포넌트, Route Handler 등)에서만 필요한 경우에 한해 엄격히 사용한다. (클라이언트 단에 노출 절대 금지)


## Coding Conventions

- Default to Server Components unless a Client Component is required.
- Use Tailwind CSS for styling.
- Keep components simple and easy to verify.
- Prefer files inside `app/` for routes.

## Design Tokens

- Primary color: shadcn/ui --primary
- Background: --background
- Card: shadcn/ui Card 컴포넌트 사용 (rounded-lg shadow-sm)
- Spacing: 컨텐츠 간격 space-y-6, 카드 내부 p-6
- Max width: max-w-4xl mx-auto (메인 컨텐츠)
- 반응형: md 이상 2열 그리드, 모바일 1열

## Component Rules

- UI 컴포넌트는 shadcn/ui 사용 (components/ui/)
- Button, Card, Input, Dialog 등 shadcn/ui 컴포넌트 우선
- 커스텀 컴포넌트는 components/ 루트에 배치
- Tailwind 기본 컬러 직접 사용 금지 → CSS 변수(디자인 토큰) 사용

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless interactivity or browser APIs are actually needed.
