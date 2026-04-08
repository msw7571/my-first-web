export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

export const posts: Post[] = [
  {
    id: 1,
    title: "나의 첫 블로그를 시작하며",
    content: "한신대학교 공공인재빅데이터융합학 전공자로서의 고민과 배움을 이곳에 담으려 합니다.",
    author: "민성욱",
    date: "2026-03-25"
  },
  {
    id: 2,
    title: "기타 연주와 코딩의 공통점",
    content: "취미로 즐기는 기타와 야구, 그리고 게임이 저의 코딩 실력에 어떤 영향을 주었을까요?",
    author: "민성욱",
    date: "2026-03-20"
  },
  {
    id: 3,
    title: "빅데이터 융합학에서 배운 데이터 분석 기초",
    content: "데이터를 읽는 힘은 현대 사회에서 필수적인 소양입니다. 첫 프로젝트의 소감을 공유합니다.",
    author: "민성욱",
    date: "2026-03-15"
  }
];
