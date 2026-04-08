import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 블로그",
  description: "나의 첫 번째 블로그입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-4xl mx-auto">
            내 블로그
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>
        <footer className="text-center text-gray-500 py-8">
          © 2026 내 블로그
        </footer>
      </body>
    </html>
  );
}
