export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/70 px-4 py-20">
      <div className="inline-flex items-center gap-3 rounded-3xl bg-background/90 px-6 py-6 text-gray-500 shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <span className="text-base font-medium">페이지를 준비 중입니다...</span>
      </div>
    </div>
  );
}
