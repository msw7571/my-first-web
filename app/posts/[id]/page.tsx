import Link from "next/link";
import { posts } from "@/lib/posts";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">게시글을 찾을 수 없습니다</h2>
        <p className="text-gray-500 mb-8">요청하신 게시글이 존재하지 않거나 삭제되었을 수 있습니다.</p>
        <Link 
          href="/posts"
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto py-10">
      <header className="mb-10 text-center">
        <div className="mb-4">
          <Link 
            href="/posts"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span className="font-medium text-gray-900">{post.author}</span>
          <span>•</span>
          <time>{post.date}</time>
        </div>
      </header>

      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        {post.content.split('\n').map((line, index) => (
          <p key={index} className="mb-4">
            {line}
          </p>
        ))}
      </div>

      <footer className="mt-12 pt-8 border-t border-gray-100">
        <div className="flex justify-center">
          <Link 
            href="/posts"
            className="px-8 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 border border-gray-200"
          >
            전체 목록 보기
          </Link>
        </div>
      </footer>
    </article>
  );
}
