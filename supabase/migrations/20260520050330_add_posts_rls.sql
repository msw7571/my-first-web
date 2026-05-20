-- Enable Row Level Security on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 주의: 이미 같은 이름의 정책이 있으면 중복 생성되지 않도록 DROP을 먼저 실행합니다.
DROP POLICY IF EXISTS posts_select_public ON public.posts;
CREATE POLICY posts_select_public
  ON public.posts
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS posts_insert_owner ON public.posts;
CREATE POLICY posts_insert_owner
  ON public.posts
  FOR INSERT
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS posts_update_owner ON public.posts;
CREATE POLICY posts_update_owner
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS posts_delete_owner ON public.posts;
CREATE POLICY posts_delete_owner
  ON public.posts
  FOR DELETE
  USING (auth.uid() = user_id);