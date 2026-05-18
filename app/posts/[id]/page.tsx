import Link from "next/link";
import { Post } from "@/lib/posts";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import PostActionButtons from "@/components/PostActionButtons";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

import { supabase } from "@/lib/supabase";

async function getPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch post from Supabase:", error);
    return null;
  }

  return data as Post;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const content = post.content || "";

  return (
    <article className="max-w-2xl mx-auto py-10">
      <header className="mb-10 text-center">
        <div className="mb-4">
          <Button variant="ghost" className="text-gray-500 hover:text-gray-800 flex gap-2" asChild>
            <Link href="/posts">
              ← 목록으로 돌아가기
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 px-4">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span className="font-medium text-gray-900">작성자: {post.user_id ? post.user_id.slice(0, 8) : "익명"}</span>
          <span>•</span>
          <time>{post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : ""}</time>
        </div>
      </header> 

      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mx-4">
        {content.split('\n').map((line, index) => (
          <p key={index} className="mb-4">
            {line}
          </p>
        ))}
      </div>

      <PostActionButtons post={post} />

      <footer className="mt-12 pt-8 border-t border-gray-100">
        <div className="flex justify-center">
          <Button variant="outline" size="lg" className="px-8 py-6 text-base rounded-xl" asChild>
            <Link href="/posts">
              전체 목록 보기
            </Link>
          </Button>
        </div>
      </footer>
    </article>
  );
}
