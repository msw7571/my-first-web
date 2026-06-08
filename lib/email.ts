import nodemailer from "nodemailer";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM ?? "no-reply@example.com";

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP 환경 변수가 설정되어 있지 않습니다. SMTP_HOST, SMTP_USER, SMTP_PASSWORD를 확인해주세요."
    );
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user,
      pass,
    },
    from,
  };
}

export async function sendVerificationEmail(email: string, code: string) {
  const { host, port, secure, auth, from } = getSmtpConfig();
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "[회원가입 인증] 6자리 인증번호가 도착했습니다",
    text: `안녕하세요!\n\n회원가입을 완료하려면 아래 6자리 인증번호를 입력해주세요.\n\n인증번호: ${code}\n\n이 인증번호는 10분 동안 유효합니다.`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #111;">
        <h2>회원가입 인증번호</h2>
        <p>아래 6자리 인증번호를 입력하여 회원가입을 완료하세요.</p>
        <p style="font-size: 1.5rem; font-weight: 700; margin: 1rem 0;">${code}</p>
        <p>이 인증번호는 <strong>10분 동안</strong> 유효합니다.</p>
      </div>
    `,
  });
}
