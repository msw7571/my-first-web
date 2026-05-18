export interface Post {
  id: string; // uuid
  user_id: string; // uuid
  title: string;
  content: string;
  created_at: string; // timestamptz
  
  // 유지: 하위 호환성 (JSONPlaceholder 또는 기존 코드)
  author?: string;
  date?: string;
  body?: string;
}
