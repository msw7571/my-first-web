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
- [ ] 게시글 CRUD와 Auth 연동 (Ch10)
  - [ ] 데이터베이스 접근에 Ch8 `lib/supabase/client.ts` 사용
  - [ ] Ch9 `useAuth` 기반 작성자 정보가 포함된 게시글 작성
  - [ ] 게시글 수정 및 삭제 기능 구현
  - [ ] 게시글 수정/삭제 UI 권한 제어 (프론트엔드 UX 처리)

## 3단계: 고급 기능 (Ch11~12)

- [ ] RLS (Row Level Security) 설정으로 실제 데이터 보호 (Ch11)
- [ ] 마이페이지
- [ ] 댓글 기능

## 진행률: 9/14 (64%)