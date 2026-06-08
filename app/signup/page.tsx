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
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"request" | "verify">("request");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendCode = async (event: React.FormEvent<HTMLFormElement>) => {
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
        setErrorMessage(result?.error || "인증번호 전송에 실패했습니다.");
        return;
      }

      if (result?.debugCode) {
        setSuccessMessage(`인증번호를 발송했습니다. (개발용 코드: ${result.debugCode})`);
      } else {
        setSuccessMessage("인증번호를 발송했습니다. 이메일을 확인해주세요.");
      }
      setStep("verify");
    } catch (error) {
      console.error("Send code error:", error);
      setErrorMessage("인증번호 전송 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
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
        setErrorMessage(result?.error || "회원가입에 실패했습니다.");
        return;
      }

      setSuccessMessage("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
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
          <CardTitle className="text-2xl text-center">회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendCode} className="space-y-4">
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

            <Button type="submit" className="w-full" disabled={loading || !email || step === "verify"}>
              {loading ? "전송 중..." : step === "request" ? "인증번호 받기" : "인증번호 재전송"}
            </Button>
          </form>

          {step === "verify" && (
            <form onSubmit={handleVerify} className="space-y-4 mt-6">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  인증번호
                </label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6자리 인증번호"
                  required
                />
              </div>

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
                />
              </div>

              {errorMessage && <p className="text-sm text-destructive font-medium">{errorMessage}</p>}
              {successMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "확인 중..." : "인증번호 확인하고 가입"}
              </Button>
            </form>
          )}

          <div className="text-center text-sm text-muted-foreground mt-4">
            이미 계정이 있으신가요? <Link href="/login" className="text-primary hover:underline">로그인</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
