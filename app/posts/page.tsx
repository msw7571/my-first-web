import { Post } from "@/lib/posts";
import PostContainer from "@/components/PostContainer";

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10", {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  
  return res.json();
}

export default async function PostsPage() {
  const initialPosts = await getPosts();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
        블로그 게시글 관리
      </h1>
      <PostContainer initialPosts={initialPosts} />
    </div>
  );
}
