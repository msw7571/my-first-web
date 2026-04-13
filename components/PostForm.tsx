"use client";

import { useState } from "react";
import { Post } from "@/lib/posts";

interface PostFormProps {
  onAdd: (post: Post) => void;
}

export default function PostForm({ onAdd }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }

    const newPost: Post = {
      id: Date.now(), // Simple unique ID
      title,
      content,
      author: "익명",
      date: new Date().toISOString().split("T")[0],
    };

    onAdd(newPost);
    setTitle("");
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 space-y-4 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">새 글 작성하기</h3>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all bg-white"
        />
      </div>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all bg-white"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all active:scale-[0.98]"
      >
        작성 완료
      </button>
    </form>
  );
}
