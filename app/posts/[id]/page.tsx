import Link from "next/link";
import { Post } from "@/lib/posts";
import { getSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import PostActionButtons from "@/components/PostActionButtons";
import CommentsSection from "@/components/CommentsSection";
import LikeButton from "@/components/LikeButton";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string): Promise<Post> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch post from Supabase:", error);
    throw new Error("게시글을 불러오는 중 오류가 발생했습니다.");
  }

  if (!data) {
    notFound();
  }

  return data as Post;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

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

      <div className="mt-8">
        <LikeButton postId={post.id} />
      </div>

      <CommentsSection postId={post.id} />

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
