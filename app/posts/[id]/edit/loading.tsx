export default function PostEditLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="inline-flex items-center gap-3 rounded-3xl bg-muted/70 px-6 py-6 text-gray-500 shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <span className="text-base font-medium">게시글 수정 페이지를 준비 중입니다...</span>
      </div>
    </div>
  );
}
