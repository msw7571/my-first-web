"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Post } from "@/lib/posts";
import PostContainer from "@/components/PostContainer";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content, created_at, user_id")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setPosts(data as Post[]);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">에러가 발생했습니다: {error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-8 text-foreground">블로그 게시글 관리</h1>
        <div className="py-12 text-gray-500">게시글이 없습니다. 첫 글을 작성해보세요!</div>
        {/* 새 글 작성 버튼 등은 PostContainer나 헤더에 있으므로 이대로 표시 */}
        <PostContainer initialPosts={posts} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
        블로그 게시글 관리
      </h1>
      {/* PostContainer 내부에서 /posts/[id] 링크를 제공함 */}
      <PostContainer initialPosts={posts} />
    </div>
  );
}
