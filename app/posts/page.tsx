import Link from "next/link";
import { posts } from "@/lib/posts";

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">전체 글 목록</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={`/posts/${post.id}`}
            className="block group"
          >
            <article className="h-full border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:border-gray-800 bg-white">
              <h2 className="text-xl font-semibold mb-3 group-hover:text-gray-900 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed">
                {post.content}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 text-xs text-gray-400 font-medium">
                <span>{post.author}</span>
                <time>{post.date}</time>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
