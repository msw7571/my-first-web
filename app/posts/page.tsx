"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Post } from "@/lib/posts";
import PostContainer from "@/components/PostContainer";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content, created_at, user_id")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("게시글 불러오기 오류:", error);
        setError("게시글을 가져오는 중 문제가 발생했습니다.");
        setPosts([]);
      } else {
        setPosts((data as Post[]) || []);
      }
    } catch (fetchError) {
      console.error("게시글 로딩 중 예기치 않은 오류:", fetchError);
      setError("게시글을 가져오는 중 문제가 발생했습니다.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center text-gray-500">
        <div className="inline-flex items-center gap-3 rounded-3xl bg-muted/70 px-6 py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <span className="text-lg font-medium">게시글을 불러오는 중입니다...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <p className="text-xl font-semibold text-destructive">문제가 발생했습니다.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            게시글 목록을 가져오는 동안 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={fetchPosts}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
        블로그 게시글 관리
      </h1>

      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-muted/50 p-8 text-center">
          <p className="text-2xl font-semibold text-foreground">아직 게시글이 없어요.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            아직 작성된 게시글이 없습니다. 새 글을 작성해서 블로그를 채워보세요.
          </p>
        </div>
      ) : null}

      <PostContainer initialPosts={posts} />
    </div>
  );
}
