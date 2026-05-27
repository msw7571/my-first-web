# 🏗️ 개인 블로그 아키텍처 (ARCHITECTURE)

## 1. 프로젝트 목표
이 프로젝트는 개인의 생각과 배움을 기록하고 공유하기 위한 블로그 웹 애플리케이션입니다. 
Next.js의 App Router를 기반으로 구축하여 빠른 렌더링 성능과 직관적인 라우팅 구조를 제공하며, 단계적으로 UI 프레임워크와 데이터베이스를 도입하여 확장성 있고 유지보수가 용이한 아키텍처를 구성하는 것을 목표로 합니다.

## 2. 페이지 맵 (Page Map)
Next.js App Router 파일 시스템 기반의 URL 라우팅 구조입니다.

| 기능 | URL 경로 (App Router) | 목적 |
|---|---|---|
| **홈** | `/` | 블로그의 첫 진입점, 소개 및 요약 정보를 제공 |
| **글 목록** | `/posts` | 등록된 모든 게시글 목록을 나열하고 검색하는 공간 |
| **글 상세** | `/posts/[id]` | 개별 게시글의 전체 내용을 읽고 확인하는 페이지 |
| **글 작성** | `/posts/new` | 새로운 게시글(제목, 내용 등)을 작성하고 등록하는 폼 페이지 |
| **로그인** | `/login` | 글 작성 및 회원 전용 기능을 사용하기 위한 인증 페이지 |
| **마이페이지**| `/mypage` | 계정 정보 확인 및 내가 쓴 글 등 개인화 데이터를 관리하는 공간 |

## 3. 유저 플로우 (User Flow)

### 📖 글 읽기 흐름
1. 방문자가 블로그 **홈(`/`)**에 접속합니다.
2. 내비게이션 메뉴를 통해 **글 목록(`/posts`)**으로 이동하여 읽고 싶은 글을 탐색합니다.
3. 목록에서 제목을 클릭하여 **글 상세(`/posts/[id]`)** 페이지로 이동한 뒤 본문을 읽습니다.
4. 다 읽은 후 다시 목록으로 돌아가거나 홈으로 이동합니다.

### ✍️ 글 작성 흐름
1. 작성자가 **로그인(`/login`)** 페이지에서 인증을 완료합니다.
2. 블로그 화면에서 '새 글 쓰기' 버튼을 클릭하여 **글 작성(`/posts/new`)** 폼으로 이동합니다.
3. 글의 제목과 내용을 입력하고 등록(Submit) 버튼을 누릅니다.
4. 글 작성이 성공하면, 작성된 글을 바로 확인할 수 있는 **글 상세(`/posts/[id]`)** 페이지로 자동 리다이렉트됩니다.

### 👤 마이페이지 확인 흐름
1. 등록된 사용자가 **로그인(`/login`)**을 수행합니다.
2. 헤더의 프로필 메뉴나 링크를 클릭하여 **마이페이지(`/mypage`)**에 진입합니다.
3. 페이지 내에서 자신의 기본 정보와 이전에 작성했던 글 목록을 확인하고 관리합니다.

---

## 4. 컴포넌트 구조 (Component Structure)
UI의 일관성과 높은 사용성을 보장하기 위해 `shadcn/ui` 컴포넌트를 코어 요소로 활용합니다.

- **Button (`@/components/ui/button`)**
  - **목적**: 클릭 가능한 액션 및 네비게이션 시각화
  - **적용 위치**: `PostForm`의 작성 완료 버튼, `app/posts/[id]`의 '목록으로 돌아가기' 링크 버튼, 폼 제출 및 각종 취소/확인 버튼

- **Card (`@/components/ui/card`)**
  - **목적**: 개별 컨텐츠의 독립적인 영역 구분 및 그룹화
  - **적용 위치**: `PostContainer`의 글 목록 렌더링 (`CardHeader`, `CardTitle`, `CardContent`, `CardFooter`를 조합하여 게시글 메타데이터와 요약 본문 표시)

- **Input (`@/components/ui/input`)**
  - **목적**: 단일 텍스트 기반의 사용자 입력 폼 제공
  - **적용 위치**: `SearchBar`의 검색어 입력 필드, `PostForm`의 글 제목 입력란

- **Dialog (`@/components/ui/dialog`)**
  - **목적**: 중요한 결정이나 파괴적인 액션(삭제 등) 수행 전 사용자 확인
  - **적용 위치**: `PostContainer` 내의 글 삭제 버튼 클릭 시 나타나는 최종 경고 및 확인 모달 팝업

## 5. 데이터 모델 (Data Model)
Supabase (PostgreSQL) 기반의 관계형 데이터베이스 모델로 구성되어 있습니다. 향후 로그인 체계와 결합될 구조를 반영합니다.

### 테이블 관계
블로그 사용자 프로필(`profiles`)과 게시글(`posts`)은 **1:N (일대다) 관계**를 형성합니다. 즉, 한 명의 사용자가 여러 개의 게시글을 작성할 수 있습니다.

### `posts` 테이블
사용자가 작성한 게시글 데이터를 저장합니다.
- `id` (uuid) : 게시글의 고유 식별자 (Primary Key)
- `user_id` (uuid) : 글을 작성한 사용자의 식별자 (Foreign Key → `profiles.id` 참조)
- `title` (text) : 게시글 제목 (Not Null)
- `content` (text) : 게시글 본문 내용 (Not Null)
- `created_at` (timestamptz) : 글이 작성된 시각

### `profiles` 테이블
Supabase Auth(`auth.users`)와 연결된 사용자 프로필 정보를 관리합니다.
- `id` (uuid) : 프로필 고유 식별자 (Primary Key, `auth.users(id)` 참조)
- `username` (text) : 사용자 이름 또는 닉네임
- `avatar_url` (text) : 프로필 이미지 URL
- `role` (text) : 사용자 역할 정보

---

## 6. 인증 및 데이터 연동 (Auth & Data Flow)
Ch11 기준으로 게시글 CRUD 및 보안은 다음 규칙을 따릅니다.

- **데이터베이스 접근**: `lib/supabase/client.ts`에 정의된 Supabase 클라이언트를 단일 진입점으로 사용합니다.
- **사용자 인증**: Ch9에서 구현한 `useAuth` 훅과 `AuthProvider` 컨텍스트를 통해 현재 로그인한 사용자 정보에 접근합니다.
- **게시글 작성**: 새 글 작성 시 `useAuth`에서 가져온 유저 정보를 바탕으로 `user_id`를 할당합니다.
- **RLS 적용 대상**: `posts` 테이블과 `profiles` 테이블을 우선 대상으로 삼아 Row Level Security를 적용합니다.
- **보안 및 권한 처리**:
  - **프론트엔드 UX 제어**: 수정/삭제 버튼 노출 여부는 본인이 작성한 게시글인지 확인하여 조건부 렌더링을 진행합니다.
  - **보안 계층 분리**: UI 분기는 사용자 경험(UX)을 위한 분기이며, 실질적인 보안은 데이터베이스 레벨의 RLS가 담당합니다.
  - **백엔드/데이터베이스 보안 (RLS)**: 클라이언트 UI 분기는 완벽한 보안책이 될 수 없으므로, Supabase **RLS (Row Level Security)** 정책을 적용하여 실제 데이터베이스 레벨에서 침입 및 권한 없는 변조를 완벽히 통제합니다.
  - **RLS 마이그레이션 관리**: RLS 정책은 Supabase Dashboard SQL Editor에서 수동으로 실행하지 않고, **Supabase CLI 마이그레이션 파일**로 저장하고 기록하여 형상 관리를 보장합니다.
  - **정책 규칙**:
    - `posts` 테이블의 SELECT 정책은 모든 사용자에게 개방(True)합니다.
    - `posts` 테이블의 INSERT 정책은 로그인된 사용자만 가능하며, `auth.uid() = user_id` 조건이 성립해야 합니다.
    - `posts` 테이블의 UPDATE, DELETE 정책은 `auth.uid() = user_id` 조건이 성립하는 작성자 본인 레코드만 가능하도록 제한합니다.
    - `profiles` 테이블의 SELECT 정책은 전체 공개하며, INSERT 및 UPDATE는 `auth.uid() = id` 인 본인 프로필만 수정 가능하도록 제한합니다.
  - **보안 수칙**: 클라이언트 단에서 무제한 권한을 가진 `service_role` API 키를 유출하거나 사용하지 않고, 익명 키(`anon_key`) 환경 하에 RLS로 각 사용자의 데이터 소유권을 보호합니다.
  - **보호 정책 목록**:
    - `posts_select_public` : SELECT, 모든 사용자 허용
    - `posts_insert_owner` : INSERT, `auth.uid() = user_id` 확인
    - `posts_update_owner` : UPDATE, `auth.uid() = user_id` 확인 및 수정 후에도 동일 여부 확인
    - `posts_delete_owner` : DELETE, `auth.uid() = user_id` 확인

## 7. 에러 처리 및 UX 상태 관리

- 전체 앱 공통 로딩/에러 경계
  - `app/loading.tsx`: 전체 App Router 레벨 로딩 인터셉터
  - `app/error.tsx`: 전체 앱 오류 발생 시 친절한 안내 화면과 재시도 버튼
- `/posts` 화면 상태
  - `app/posts/loading.tsx`: 게시글 목록 페이지 로딩 화면
  - `app/posts/error.tsx`: 게시글 목록 페이지 오류 안내 화면
  - `/posts` 목록 페이지는 로딩, 빈 상태, 에러 상태를 모두 처리하도록 구성
- 게시글 상세 및 수정 페이지 상태
  - `app/posts/[id]/loading.tsx`: 게시글 상세 로딩 화면
  - `app/posts/[id]/edit/loading.tsx`: 게시글 수정 페이지 로딩 화면
- 폼 유효성 규칙
  - `PostForm`에서 제목은 필수, 최소 2자
  - `PostForm`에서 내용은 필수, 최소 10자
  - 제출 중에는 버튼 비활성화하여 중복 제출 방지
  - 실패 시 해당 입력 아래에 에러 메시지 표시
- 에러 메시지 변환 규칙
  - `lib/error-message.ts`를 통해 Supabase/네트워크 오류를 화면용으로 변환
    - `42501` 또는 `row-level security` → `이 작업을 수행할 권한이 없습니다.`
    - `Failed to fetch` → `인터넷 연결을 확인해주세요.`
    - `not found` 계열 → `요청한 게시글을 찾을 수 없습니다.`
    - 기본값 → `일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`
  - 로그인/회원가입 페이지에서 Supabase 오류 원문 대신 변환된 메시지를 사용자에게 표시하고, `console.error`는 개발자 로그로 유지합니다.

