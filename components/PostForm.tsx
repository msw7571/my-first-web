"use client";

import { useRef } from "react";
import { createPostAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PostForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        const result = await createPostAction(formData);
        if (result.error) {
          alert(result.error);
        } else {
          formRef.current?.reset();
        }
      }}
      className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 space-y-4 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">새 글 작성하기</h3>
      <div>
        <Input
          type="text"
          name="title"
          required
          placeholder="제목"
          className="w-full bg-white"
        />
      </div>
      <div>
        <textarea
          name="content"
          required
          placeholder="내용을 입력하세요..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all bg-white"
        />
      </div>
      <Button
        type="submit"
        className="w-full py-6 text-base rounded-lg"
      >
        작성 완료
      </Button>
    </form>
  );
}
