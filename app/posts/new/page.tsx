"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate backend processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    alert("저장되었습니다");
    router.push("/posts");
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">새 게시글 작성</h1>
        <p className="text-gray-500">당신의 소중한 생각을 기록해보세요.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            제목
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all placeholder:text-gray-300 text-gray-800"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            내용
          </label>
          <textarea
            id="content"
            required
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all placeholder:text-gray-300 text-gray-800 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/posts"
            className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "저장 중..." : "게시하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
