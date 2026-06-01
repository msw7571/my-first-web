-- likes: 사용자가 게시글에 좋아요를 한 번만 누를 수 있도록 저장
create table likes (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
