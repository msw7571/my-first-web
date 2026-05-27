import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import PostForm from "@/components/PostForm";
import { Post } from "@/lib/posts";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch post for edit:", error);
    throw new Error("게시글을 불러오는 중 오류가 발생했습니다.");
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">게시글 수정</h1>
      <PostForm initialData={post as Post} />
    </div>
  );
}
