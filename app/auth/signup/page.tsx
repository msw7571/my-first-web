"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRequestCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result?.error || "인증번호 발송에 실패했습니다.");
        return;
      }

      setStep("verify");
      setSuccessMessage("이메일로 6자리 인증번호를 발송했습니다. 이메일을 확인해주세요.");
    } catch (error) {
      console.error("Request code error:", error);
      setErrorMessage("인증번호 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, password, code }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result?.error || "인증번호 확인에 실패했습니다.");
        return;
      }

      setSuccessMessage("이메일 인증에 성공했습니다. 로그인 페이지로 이동합니다.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      console.error("Verify code error:", error);
      setErrorMessage("인증번호 확인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">이메일 회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === "request" ? handleRequestCode : handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                이름
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                required
                disabled={step === "verify"}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={step === "verify"}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자리 이상 입력해주세요"
                required
                minLength={6}
                disabled={step === "verify"}
              />
            </div>

            {step === "verify" && (
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  6자리 인증번호
                </label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  required
                  maxLength={6}
                />
              </div>
            )}

            {errorMessage && <p className="text-sm text-destructive font-medium">{errorMessage}</p>}
            {successMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "처리 중..." : step === "request" ? "인증번호 받기" : "인증 완료"}
            </Button>

            {step === "verify" && (
              <p className="text-sm text-muted-foreground">
                이메일로 전송된 인증번호를 입력해주세요.
              </p>
            )}
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            이미 계정이 있으신가요? <Link href="/login" className="text-primary hover:underline">로그인</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
