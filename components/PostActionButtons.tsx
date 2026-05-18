"use client";

import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Post } from "@/lib/posts";

interface PostActionButtonsProps {
  post: Post;
}

export default function PostActionButtons({ post }: PostActionButtonsProps) {
  const { user } = useAuth();
  const router = useRouter();

  // 주의: 여기서의 조건문은 단순 UI(프론트엔드) 분기용입니다.
  // 실제 데이터 보안 및 접근 권한 제어는 추후 Ch11 RLS(Row Level Security)에서 처리됩니다.
  if (!user || user.id !== post.user_id) {
    return null;
  }

  const handleDelete = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id)
      .eq("user_id", user.id); // 혹시 모를 검증 추가

    if (error) {
      alert("삭제 중 오류가 발생했습니다: " + error.message);
    } else {
      alert("게시글이 삭제되었습니다.");
      router.push("/posts");
      router.refresh();
    }
  };

  return (
    <div className="flex gap-2 justify-center mt-8">
      <Button variant="outline" asChild>
        <Link href={`/posts/${post.id}/edit`}>수정</Link>
      </Button>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">삭제</Button>
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
              <Button variant="destructive" onClick={handleDelete}>삭제</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
