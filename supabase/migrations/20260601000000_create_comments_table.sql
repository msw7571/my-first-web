-- comments: 게시글별 댓글 저장소
create table comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id),
  content text not null,
  created_at timestamptz default now()
);
