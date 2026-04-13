"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/lib/posts";
import SearchBar from "./SearchBar";
import PostForm from "./PostForm";

interface PostContainerProps {
  initialPosts: Post[];
}

export default function PostContainer({ initialPosts }: PostContainerProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (id: number) => {
    if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4">
      <SearchBar onSearch={setSearchQuery} />
      <PostForm onAdd={handleAddPost} />

      <h2 className="text-2xl font-bold mb-6 text-gray-800">게시글 목록</h2>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <div key={post.id} className="relative group">
              <Link href={`/posts/${post.id}`} className="block">
                <article className="h-full border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:border-gray-800 bg-white">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-gray-900 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed">
                    {post.content || post.body}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 text-xs text-gray-400 font-medium">
                    <span>{post.author || "JSONPlaceholder User"}</span>
                    <time>{post.date || "2026-04-13"}</time>
                  </div>
                </article>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeletePost(post.id);
                }}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="글 삭제"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
