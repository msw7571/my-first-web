-- email_verifications: 이메일 인증번호를 임시로 저장하는 테이블
create table email_verifications (
  email text not null primary key,
  code_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  verified_at timestamptz
);
