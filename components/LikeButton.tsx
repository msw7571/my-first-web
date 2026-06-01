"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  postId: string;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const fetchLikeData = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const countResponse = await supabase
          .from("likes")
          .select("*", { head: true, count: "exact" })
          .eq("post_id", postId);

        if (countResponse.error) {
          throw countResponse.error;
        }

        setCount(countResponse.count ?? 0);

        if (user) {
          const likedResponse = await supabase
            .from("likes")
            .select("post_id", { head: true, count: "exact" })
            .eq("post_id", postId)
            .eq("user_id", user.id);

          if (likedResponse.error) {
            throw likedResponse.error;
          }

          setLiked((likedResponse.count ?? 0) > 0);
        } else {
          setLiked(false);
        }
      } catch (error: any) {
        console.error("LikeButton fetch error:", error);
        setErrorMessage("좋아요 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikeData();
  }, [postId, user?.id]);

  const handleLikeToggle = async () => {
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const supabase = createClient();

    try {
      if (liked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        setLiked(false);
        setCount((current) => Math.max(0, current - 1));
      } else {
        const { error } = await supabase
          .from("likes")
          .insert([{ post_id: postId, user_id: user.id }]);

        if (error) {
          if (error.message?.includes("duplicate key") || error.code === "23505") {
            setLiked(true);
          } else {
            throw error;
          }
        } else {
          setLiked(true);
          setCount((current) => current + 1);
        }
      }
    } catch (error: any) {
      console.error("LikeButton toggle error:", error);
      setErrorMessage("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={liked ? "destructive" : "outline"}
          size="sm"
          className="gap-2"
          onClick={handleLikeToggle}
          disabled={loading || saving}
        >
          <Heart className={liked ? "text-red-500" : "text-gray-500"} />
          <span>{liked ? "좋아요 취소" : "좋아요"}</span>
        </Button>

        <span className="text-sm font-medium text-gray-700">{count}명</span>
      </div>

      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : (
        <p className="text-sm text-gray-500">{loading ? "좋아요 데이터를 불러오는 중..." : "한 번만 누를 수 있습니다."}</p>
      )}
    </div>
  );
}
