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
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (initialData) {
        // Update
        const { error } = await supabase
          .from("posts")
          .update({ title, content })
          .eq("id", initialData.id)
          // 주의: 이 조건은 프론트엔드 차원의 최소한의 필터링일 뿐입니다.
          // 실제 보안 및 권한 검증은 추후 Ch11 RLS(Row Level Security)에서 데이터베이스 레벨로 처리됩니다.
          .eq("user_id", user.id); 

        if (error) throw error;
        alert("게시글이 수정되었습니다.");
        router.push(`/posts/${initialData.id}`);
      } else {
        // Create
        const { data, error } = await supabase
          .from("posts")
          .insert([
            { title, content, user_id: user.id }
          ])
          .select()
          .single();

        if (error) throw error;
        alert("게시글이 작성되었습니다.");
        if (data) {
          router.push(`/posts/${data.id}`);
        } else {
          router.push("/posts");
        }
      }
      router.refresh();
    } catch (error: any) {
      console.error("Error saving post:", error);
      alert(error.message || "게시글 저장에 실패했습니다.");
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
        />
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
        />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "저장 중..." : (initialData ? "수정 완료" : "작성 완료")}
        </Button>
      </div>
    </form>
  );
}
