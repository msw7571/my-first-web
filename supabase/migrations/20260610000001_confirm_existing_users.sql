-- 기존의 인증되지 않은 모든 사용자들의 이메일을 일괄 인증 완료 처리합니다.
-- confirmed_at은 생성된 열(generated column)일 수 있으므로 email_confirmed_at만 수정합니다.
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
