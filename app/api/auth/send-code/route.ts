import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { sendVerificationEmail } from "@/lib/email";

const CODE_LENGTH = 6;
const EXPIRATION_MINUTES = 10;

function createVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    const code = createVerificationCode();
    const codeHash = hashValue(code);
    const expiresAt = new Date(Date.now() + EXPIRATION_MINUTES * 60 * 1000).toISOString();
    const createdAt = new Date().toISOString();

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.from("email_verifications").upsert(
      [
        {
          email,
          code_hash: codeHash,
          expires_at: expiresAt,
          created_at: createdAt,
          verified_at: null,
        },
      ],
      { onConflict: "email" }
    );

    if (error) {
      console.error("send-code upsert error:", error);
      return NextResponse.json(
        { error: "인증번호를 저장하는 중 문제가 발생했습니다." },
        { status: 500 }
      );
    }

    await sendVerificationEmail(email, code);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("send-code error:", err);
    return NextResponse.json(
      { error: "인증번호 전송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
