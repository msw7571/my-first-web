"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/posts";
import SearchBar from "./SearchBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PostContainerProps {
  initialPosts: Post[];
}

export default function PostContainer({ initialPosts }: PostContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const handleDeletePost = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("user_id", user?.id);

    if (error) {
      alert("삭제 중 오류가 발생했습니다: " + error.message);
    } else {
      alert("게시글이 삭제되었습니다.");
      router.refresh();
    }
  };

  const filteredPosts = initialPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto flex-1">
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/posts/new">새 글 작성하기</Link>
        </Button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-foreground">게시글 목록</h2>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted rounded-2xl border-2 border-dashed border-border">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <div key={post.id} className="relative group">
              <Link href={`/posts/${post.id}`} className="block h-full">
                <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary flex flex-col">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors text-xl leading-snug">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 p-6 pt-0">
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {post.content}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border text-xs text-muted-foreground font-medium justify-between p-6">
                    <span>작성자: {post.user_id ? post.user_id.slice(0, 8) : "익명"}</span>
                    <time>{post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : ""}</time>
                  </CardFooter>
                </Card>
              </Link>
              
              {user && user.id === post.user_id && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-colors bg-background/80 hover:bg-background shadow-sm rounded-full"
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
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>정말로 이 게시글을 삭제하시겠습니까?</DialogTitle>
                      <DialogDescription>
                        이 작업은 되돌릴 수 없으며, 데이터베이스에서 완전히 삭제됩니다.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end gap-2 sm:gap-0 mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">취소</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button variant="destructive" onClick={() => handleDeletePost(post.id)}>삭제</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
