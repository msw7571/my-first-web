"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface CommentItem {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionUser, setSessionUser] = useState<string | null>(null);

  const isLoggedIn = useMemo(() => Boolean(sessionUser), [sessionUser]);
  const trimmedComment = newComment.trim();
  const canSubmit = isLoggedIn && trimmedComment.length > 0 && !saving;

  useEffect(() => {
    const supabase = createClient();
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to check Supabase session:", error);
      }
      setSessionUser(data?.session?.user?.id ?? null);
      setSessionChecked(true);
    };

    loadSession();
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const fetchComments = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("comments")
        .select("id, post_id, user_id, content, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("댓글을 불러오는 중 오류 발생:", error);
        setErrorMessage("댓글을 불러오는 중 문제가 발생했습니다.");
        setComments([]);
      } else {
        setComments(data ?? []);
      }

      setLoading(false);
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!isLoggedIn || !user) {
      setErrorMessage("댓글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    if (trimmedComment.length === 0) {
      setErrorMessage("댓글 내용을 입력해 주세요.");
      return;
    }

    setSaving(true);

    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            content: trimmedComment,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setComments((current) => {
          const next = current ? [...current, data] : [data];
          return next;
        });
        setNewComment("");
      }
    } catch (error: any) {
      console.error("댓글 등록 실패:", error);
      setErrorMessage(error?.message || "댓글 등록 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-14 space-y-6 bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">댓글</h2>
          <p className="text-sm text-gray-500">게시글에 대한 의견을 남겨보세요.</p>
        </div>
        <p className="text-sm text-gray-500">
          {comments?.length ?? 0}개 댓글
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="comment" className="sr-only">
          댓글 내용
        </label>
        <textarea
          id="comment"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          rows={5}
          placeholder={
            isLoggedIn
              ? "댓글을 입력해 주세요."
              : sessionChecked
              ? "로그인이 필요합니다."
              : "세션을 확인 중입니다..."
          }
          disabled={!isLoggedIn || saving}
          className="w-full min-h-[140px] rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70 transition"
        />

        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            {isLoggedIn
              ? "좋은 댓글을 작성해 보세요."
              : "로그인하면 댓글을 작성할 수 있습니다."}
          </p>
          <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
            {saving ? "등록 중..." : "댓글 등록"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            댓글을 불러오는 중입니다...
          </div>
        ) : comments?.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            첫 댓글을 남겨보세요!
          </div>
        ) : (
          comments?.map((comment) => (
            <article key={comment.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex items-center justify-between gap-4 text-sm text-gray-500 mb-3">
                <span className="font-medium text-gray-900">
                  {comment.user_id ? `사용자 ${comment.user_id.slice(0, 8)}` : "익명"}
                </span>
                <time dateTime={comment.created_at} className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <p className="whitespace-pre-wrap text-gray-700">{comment.content}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
