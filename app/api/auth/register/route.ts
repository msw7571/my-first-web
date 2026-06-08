import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const password = String(body.password || "");

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "이메일, 이름, 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    const { data: createResult, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

    if (createError || !createResult.user) {
      console.error("register error:", createError);
      const duplicateEmail =
        createError?.message?.includes("already registered") ||
        createError?.message?.includes("duplicate");

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

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("register route error:", err);
    return NextResponse.json(
      { error: err?.message || "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
