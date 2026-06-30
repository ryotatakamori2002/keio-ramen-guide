-- Keio Ramen Guide — Supabase スキーマ
-- 実行: Supabase ダッシュボード > SQL Editor にこの内容を貼って Run。
-- もしくは: supabase db push / psql で適用。

-- ============================================================
-- 1) 店舗テーブル（将来DB化用。MVPでは lib/shops.ts のローカルデータを使い続けてよい）
-- ============================================================
create table if not exists public.ramen_shops (
  id text primary key,
  name text not null,
  area text,
  station text,
  genres text[] default '{}',
  first_visit_order text,
  expected_spend_note text,
  selection_reason text,
  avoid_if text,
  google_maps_url text,
  publish_status text default 'candidate',
  data_confidence text default 'low',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 2) 実食投稿テーブル（承認制）
-- ============================================================
create table if not exists public.ramen_posts (
  id uuid primary key default gen_random_uuid(),
  shop_id text not null,
  nickname text,
  menu_name text not null,
  price_yen integer,
  body text,
  scene_tags text[] default '{}',
  image_url text,
  image_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists ramen_posts_shop_status_idx on public.ramen_posts (shop_id, status);
create index if not exists ramen_posts_status_created_idx on public.ramen_posts (status, created_at desc);

-- ============================================================
-- 3) RLS（行レベルセキュリティ）
--    書き込み・承認はサーバーの service role 経由（RLSをバイパス）で行う。
--    anon（公開クライアント）には「承認済みの読み取り」だけ許可する。
-- ============================================================
alter table public.ramen_posts enable row level security;

drop policy if exists "approved posts are public" on public.ramen_posts;
create policy "approved posts are public"
  on public.ramen_posts for select
  to anon, authenticated
  using (status = 'approved');

-- insert/update/delete の anon ポリシーは作らない（= service role のみ実行可能）。
-- これにより、投稿の作成・承認・却下・削除はサーバー側のチェックを通したものだけになる。

alter table public.ramen_shops enable row level security;
drop policy if exists "shops are public" on public.ramen_shops;
create policy "shops are public"
  on public.ramen_shops for select
  to anon, authenticated
  using (true);

-- ============================================================
-- 4) Storage バケット（投稿画像）
--    画像は ramen-post-images/posts/{uuid}.jpg に保存する。
--    公開読み取り可（URLは推測困難なUUID）。アップロードは service role 経由のみ。
-- ============================================================
insert into storage.buckets (id, name, public)
values ('ramen-post-images', 'ramen-post-images', true)
on conflict (id) do nothing;

drop policy if exists "post images are public" on storage.objects;
create policy "post images are public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'ramen-post-images');
