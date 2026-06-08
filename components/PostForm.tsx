"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/posts";

interface PostFormProps {
  initialData?: Post;
}

export default function PostForm({ initialData }: PostFormProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [formError, setFormError] = useState("");
  const isSubmitting = loading || authLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError("");
    setContentError("");
    setFormError("");

    if (authLoading) {
      setFormError("로그인 정보를 확인 중입니다. 잠시만 기다려주세요.");
      return;
    }

    if (!user) {
      setFormError("로그인이 필요합니다.");
      router.push("/login");
      setLoading(false);
      return;
    }

    let hasError = false;

    if (title.trim().length < 2) {
      setTitleError("제목은 최소 2자 이상이어야 합니다.");
      hasError = true;
    }

    if (content.trim().length < 10) {
      setContentError("내용은 최소 10자 이상이어야 합니다.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (initialData) {
        const { error } = await supabase
          .from("posts")
          .update({ title, content })
          .eq("id", initialData.id)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        await router.push(`/posts/${initialData.id}`);
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .insert([{ title, content, user_id: user.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const destination = data?.id ? `/posts/${data.id}` : "/posts";
      await router.push(destination);
    } catch (error: any) {
      console.error("Error saving post:", error);
      setFormError(error?.message || "게시글 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-card p-8 rounded-2xl border border-border shadow-sm">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2 text-foreground">제목</label>
        <Input
          id="title"
          type="text"
          required
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-background"
          disabled={loading}
        />
        {titleError ? (
          <p className="mt-2 text-sm text-destructive">{titleError}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2 text-foreground">내용</label>
        <textarea
          id="content"
          required
          placeholder="내용을 입력하세요..."
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all bg-background text-foreground resize-y"
          disabled={loading}
        />
        {contentError ? (
          <p className="mt-2 text-sm text-destructive">{contentError}</p>
        ) : null}
      </div>

      {formError && (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "저장 중..." : (initialData ? "수정 완료" : "작성 완료")}
        </Button>
      </div>
    </form>
  );
}
