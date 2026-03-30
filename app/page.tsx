export default function Home() {
  const posts = [
    {
      title: "나의 첫 블로그를 시작하며",
      excerpt: "한신대학교 공공인재빅데이터융합학 전공자로서의 고민과 배움을 이곳에 담으려 합니다.",
      author: "민성욱",
      date: "2026.03.25"
    },
    {
      title: "기타 연주와 코딩의 공통점",
      excerpt: "취미로 즐기는 기타와 야구, 그리고 게임이 저의 코딩 실력에 어떤 영향을 주었을까요?",
      author: "민성욱",
      date: "2026.03.20"
    },
    {
      title: "빅데이터 융합학에서 배운 데이터 분석 기초",
      excerpt: "데이터를 읽는 힘은 현대 사회에서 필수적인 소양입니다. 첫 프로젝트의 소감을 공유합니다.",
      author: "민성욱",
      date: "2026.03.15"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="py-6 border-b mb-8">
        <h1 className="text-2xl font-bold mb-4">성욱의 데브로그</h1>
        <nav>
          <ul className="flex gap-4 list-none p-0">
            <li><a href="#" className="hover:text-blue-500 transition">홈</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">포스트</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">소개</a></li>
          </ul>
        </nav>
      </header>

      <main className="grid gap-6">
        {posts.map((post, idx) => (
          <article key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">작성자: {post.author}</span>
              <time className="text-gray-400">{post.date}</time>
            </div>
          </article>
        ))}
      </main>

      <footer className="mt-12 pt-6 border-t text-center text-gray-400 text-sm">
        <p>&copy; 2026 성욱의 데브로그. All rights reserved.</p>
      </footer>
    </div>
  );
}
