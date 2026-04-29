import { Post } from "@/lib/posts";
import PostContainer from "@/components/PostContainer";
import { supabase } from "@/lib/supabase";

async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch posts from Supabase:", error);
    return [];
  }
  
  return data as Post[];
}

export default async function PostsPage() {
  const initialPosts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
        블로그 게시글 관리
      </h1>
      <PostContainer initialPosts={initialPosts} />
    </div>
  );
}
