"use client";

import { useEffect } from "react";

interface RootErrorProps {
  error: Error;
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/70 px-4 py-20">
      <div className="max-w-xl rounded-3xl border border-border bg-background p-10 text-center shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">문제 발생</p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">앱을 불러오는 동안 문제가 생겼습니다.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          죄송합니다. 잠시 후 다시 시도하거나 페이지를 새로 고침해 주세요.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
