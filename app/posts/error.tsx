"use client";

import { useEffect } from "react";

interface PostsErrorProps {
  error: Error;
  reset: () => void;
}

export default function PostsError({ error, reset }: PostsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-xl rounded-3xl border border-border bg-background p-10 text-center shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">게시글 오류</p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">게시글을 불러오는 중 오류가 발생했습니다.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          데이터를 불러오지 못했습니다. 다시 시도해 보거나 나중에 다시 방문해 주세요.
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
