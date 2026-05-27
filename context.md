# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-05-20
- 완료된 작업: 홈 페이지, 헤더/푸터 레이아웃, 포스트 목록, 포스트 상세 페이지, Supabase 연동 (Ch8), Auth 인증 (Ch9 로그인/회원가입), 게시글 CRUD와 Auth 연동 (Ch10)
- 완료: RLS 보안 (Ch11)
- 미착수: 마이페이지/댓글 (Ch12)

## 기술 결정 사항

- 인증: Supabase Auth (Email)
- 상태관리: React Context (AuthProvider - Ch9)
- 데이터베이스 접근: `lib/supabase/client.ts` (Ch8)
- 프론트엔드 라우팅: Next.js App Router 전용 (`next/router` 사용 금지)
- RLS 보안 (Ch11):
  - RLS 설정 및 데이터베이스 보안 정책은 Supabase SQL Editor를 통해 직접 수동 실행하지 않고, **Supabase CLI 마이그레이션 파일**로 작성하여 관리 및 추적한다.
  - `posts` 테이블의 보안 정책은 작성자 컬럼(`user_id`)과 `auth.uid()`를 비교하여 본인의 글만 수정/삭제할 수 있도록 구성한다.
  - `posts` 테이블 RLS 활성화는 `supabase/migrations/20260520050330_add_posts_rls.sql`에 기록되어 있다.
  - 클라이언트 UI 분기(수정/삭제 버튼 노출 등)는 사용자 경험(UX) 제어 목적이며 실제 보안 역할을 하지 않고, **실제 데이터 권한 및 보안 검증은 데이터베이스 레벨의 RLS가 담당**하도록 보장한다.
  - `posts` 테이블 적용 정책: SELECT 누구나, INSERT 로그인 본인, UPDATE 작성자, DELETE 작성자
  - 테스트 결과:
    - 비로그인: 조회 가능, 작성/수정/삭제 불가
    - 사용자 A: 본인 작성/수정/삭제 가능
    - 사용자 B: 사용자 A 글 수정/삭제 불가
## 버전 비교 (교재 기준 vs 현재 설치 기준)

| 패키지명 | 교재 기준 버전 | 현재 설치 기준 버전 | 비고 |
|---|---|---|---|
| **Next.js** | `16.2.1` | `16.2.1` | 일치 |
| **React** | `19.2.4` | `19.2.4` | 일치 |
| **@supabase/supabase-js** | `2.47.12` | `^2.105.1` | 현재 설치 기준이 더 최신임 (유지) |
| **@supabase/ssr** | `0.5.2` | `^0.10.2` | 현재 설치 기준이 더 최신임 (유지) |

## 해결된 이슈

- shadcn/ui Button variant가 디자인 토큰과 불일치 → globals.css의 --primary 수정으로 해결
- 모바일 헤더 메뉴가 겹침 → Sheet 컴포넌트로 교체
- 인증된 사용자 정보 연동 및 보호 라우트 처리 (Ch9 완료)
- 게시글 저장 시 `Error saving post: {}` 오류 해결 (Ch10)
  - **원인**: `posts` 테이블의 `user_id` 컬럼이 `profiles` 테이블을 참조(Foreign Key)하고 있으나, 회원가입 시 `profiles` 테이블에 유저 정보가 삽입되지 않아 외래키 제약 조건(FK constraint) 위반이 발생했습니다.
  - **해결**:
    1. `lib/auth.ts`의 `signUpWithEmail`에서 회원가입 시 `profiles` 테이블에 프로필 레코드가 자동으로 생성되도록 보완했습니다.
    2. 기존에 가입했거나 프로필이 유실된 유저들을 위해, `contexts/AuthContext.tsx`에서 인증 세션을 로드할 때 프로필 존재 여부를 확인하고 없으면 온더플라이(on-the-fly)로 생성하도록 안전장치를 마련했습니다.
- Ch12 에러/UX 개선
  - `app/error.tsx`, `app/loading.tsx`, `app/posts/error.tsx`, `app/posts/loading.tsx`, `app/posts/[id]/loading.tsx`, `app/posts/[id]/edit/loading.tsx` 파일을 추가하여 전체/개별 페이지 로딩 및 에러 경계를 구성했습니다.
  - `/posts` 목록 페이지에서 로딩, 빈 상태, 에러 상태를 모두 처리하도록 업데이트했습니다.
  - `PostForm`에 제목 2자 이상, 내용 10자 이상 클라이언트 유효성 검사를 적용하고 제출 중에는 버튼 비활성화했습니다.
  - `lib/error-message.ts`에 Supabase/네트워크 오류 메시지를 사용자 친화적으로 변환하는 로직을 추가했습니다.

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → `next/navigation`의 redirect() 사용
- 교재 패키지 버전(Supabase-js 2.47.12)과 현재 설치 버전(^2.105.1)에 차이가 있으나, 현재 설치된 최신 버전을 유지하면서 코드는 교재 기준으로 작성함.

## 최종 검증 보고서

- 테스트 환경:
  - 로컬: `npx playwright test` 실행 확인, 현재 테스트 환경은 로컬 개발 환경 기준입니다.
  - Vercel: `vercel env ls`는 실행되었으나, 실제 배포 URL 및 프로덕션 검증은 현재 워크스페이스에서 수집되지 않았습니다. (확인 필요)
- Playwright 테스트 결과:
  - `tests/auth-crud.spec.ts` 작성 완료.
  - 로그인 후 `/posts/new`에서 게시글 작성 및 `/posts` 목록 확인 시나리오가 포함되어 있습니다.
  - 비인증 사용자의 `/posts/new` 접근 시 `/login`으로 리다이렉트되는 시나리오가 포함되어 있습니다.
- 배포 URL 수동 검증 결과:
  - 현재 배포 URL에 대한 실질적 접근 및 UI 검증은 수행되지 않았습니다. (확인 필요)
- 확인 필요:
  - Vercel 배포 성공 여부 및 production 환경에서의 라우트 보호 검증.
  - `profiles` 테이블에 대한 RLS 적용 여부와 회원가입 시 `profiles` 생성 실패 시나리오.
  - `/posts/[id]/edit` 경로에 대한 서버 차원의 보호 여부.
