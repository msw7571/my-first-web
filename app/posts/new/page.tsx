import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">새 글 작성</h1>
      <PostForm />
    </div>
  );
}
