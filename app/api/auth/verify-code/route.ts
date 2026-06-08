import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const password = String(body.password || "");
    const code = String(body.code || "").trim();

    if (!email || !name || !password || !code) {
      return NextResponse.json(
        { error: "이메일, 이름, 비밀번호, 인증번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    const codeHash = hashValue(code);
    const now = new Date().toISOString();

    const { data: verification, error: verificationError } = await supabase
      .from("email_verifications")
      .select("email,expires_at,verified_at")
      .eq("email", email)
      .eq("code_hash", codeHash)
      .single();

    if (verificationError || !verification) {
      return NextResponse.json(
        { error: "유효하지 않은 인증번호입니다. 다시 시도해주세요." },
        { status: 400 }
      );
    }

    if (verification.verified_at) {
      return NextResponse.json(
        { error: "이 인증번호는 이미 사용되었습니다." },
        { status: 400 }
      );
    }

    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "인증번호가 만료되었습니다. 다시 요청해주세요." },
        { status: 400 }
      );
    }

    const { data: createResult, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

    if (createError || !createResult.user) {
      console.error("create-user error:", createError);
      const duplicateEmail = createError?.message?.includes("already registered") || createError?.message?.includes("duplicate");

      return NextResponse.json(
        {
          error: duplicateEmail
            ? "이미 가입된 이메일입니다. 다른 이메일을 사용해주세요."
            : "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
        },
        { status: duplicateEmail ? 400 : 500 }
      );
    }

    const userId = createResult.user.id;
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId,
        username: name,
        role: "user",
      },
    ]);

    if (profileError) {
      console.error("profile insert error:", profileError);
      return NextResponse.json(
        { error: "회원 생성은 되었으나 프로필 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("email_verifications")
      .update({ verified_at: now })
      .eq("email", email);

    if (updateError) {
      console.error("verification update error:", updateError);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("verify-code error:", err);
    return NextResponse.json(
      { error: "인증번호 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
