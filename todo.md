# TODO — my-first-web

## 1단계: 기본 구조 (Ch7~8)

- [x] ARCHITECTURE.md 작성
- [x] copilot-instructions.md 작성
- [x] shadcn/ui 초기화 + 테마 설정
- [x] 헤더/푸터 레이아웃
- [x] 홈 페이지
- [x] Supabase 프로젝트 생성
- [x] 데이터베이스 스키마 작성 및 lib/supabase/client.ts 설정 (Ch8)

## 2단계: 핵심 기능 (Ch9~10)

- [x] 인증 시스템 구현: AuthProvider, 로그인/회원가입, middleware.ts (Ch9)
- [x] 게시글 CRUD와 Auth 연동 (Ch10)
  - [x] 데이터베이스 접근에 Ch8 `lib/supabase/client.ts` 사용
  - [x] Ch9 `useAuth` 기반 작성자 정보가 포함된 게시글 작성
  - [x] 게시글 수정 및 삭제 기능 구현
  - [x] 게시글 수정/삭제 UI 권한 제어 (프론트엔드 UX 처리)

## 3단계: 고급 기능 (Ch11~12)

- [x] RLS (Row Level Security) 설정으로 실제 데이터 보호 (Ch11)
  - [x] Supabase CLI 마이그레이션 파일 생성 (`supabase/migrations/20260520050330_add_posts_rls.sql`)
  - [ ] `profiles` 테이블 RLS 활성화 및 정책 정의 (SELECT: 전체 공개 / INSERT, UPDATE: auth.uid() = id 인 본인 레코드만)
  - [x] `posts` 테이블 RLS 활성화 및 정책 정의 (SELECT: 전체 공개 / INSERT: 인증 유저 && user_id = auth.uid() / UPDATE: auth.uid() = user_id / DELETE: auth.uid() = user_id)
  - [x] db push 적용 및 빌드 검증
  - [x] 다른 계정 우회 테스트
  - [x] 보안 키 노출 grep 확인
  - [x] 빌드/배포 검증
- [ ] 마이페이지 (Ch12)
- [ ] 댓글 기능 (Ch12)

## 진행률: 15/18 (Ch11 RLS 보안 완료 수준)