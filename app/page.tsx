export default function Home() {
  const posts = [
    {
      title: "나의 첫 블로그를 시작하며",
      date: "2026.03.25",
      excerpt: "한신대학교 공공인재빅데이터융합학 전공자로서의 고민과 배움을 이곳에 담으려 합니다.",
      category: "일상"
    },
    {
      title: "기타 연주와 코딩의 공통점",
      date: "2026.03.20",
      excerpt: "취미로 즐기는 기타와 야구, 그리고 게임이 저의 코딩 실력에 어떤 영향을 주었을까요?",
      category: "취미"
    },
    {
      title: "빅데이터 융합학에서 배운 데이터 분석 기초",
      date: "2026.03.15",
      excerpt: "데이터를 읽는 힘은 현대 사회에서 필수적인 소양입니다. 첫 프로젝트의 소감을 공유합니다.",
      category: "학습"
    }
  ];

  return (
    <div className="bg-zinc-50 min-h-screen font-sans">
      <header className="bg-white border-b py-6 px-4 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">성욱의 데브로그</h1>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">홈</a>
            <a href="#" className="hover:text-blue-600 transition-colors">포스트</a>
            <a href="#" className="hover:text-blue-600 transition-colors">소개</a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
        <section className="flex-1 space-y-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            최근 포스트
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          </h2>
          <div className="grid gap-6">
            {posts.map((post, idx) => (
              <article key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 rounded uppercase tracking-widest">{post.category}</span>
                  <time className="text-xs text-gray-400 font-medium">{post.date}</time>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
                  더 읽기 &rarr;
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="w-full md:w-72 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-28">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b-2 border-gray-100 flex items-center justify-between">
              프로필
              <span className="text-[10px] text-gray-400 font-normal">ABOUT ME</span>
            </h2>
            <div className="space-y-5">
              <div className="group">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">이름</span>
                <p className="text-sm font-semibold text-gray-800">민성욱 (seong wook min)</p>
              </div>
              <div className="group">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">학교</span>
                <p className="text-sm font-semibold text-gray-800">한신대학교</p>
              </div>
              <div className="group">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">전공</span>
                <p className="text-sm font-semibold text-gray-800 leading-tight">공공인재빅데이터융합학</p>
              </div>
              <div className="group">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">취미</span>
                <p className="text-sm font-semibold text-gray-800 leading-tight">기타, 야구, 게임</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button className="w-full py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200">
                팔로우 하기
              </button>
            </div>
          </div>
        </aside>
      </main>

      <footer className="bg-white border-t py-10 px-4 mt-20 text-center">
        <p className="text-sm text-gray-500">
          &copy; 2026 성욱의 데브로그. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
