-- Keio Ramen Guide — Supabase スキーマ
-- 実行: Supabase ダッシュボード > SQL Editor にこの内容を貼って Run。
-- 既存DBにも安全に再適用できるよう、可能な限り冪等（if not exists / alter add column if not exists）にしている。

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
-- 2) プロフィール（Supabase Auth のユーザーに1対1で対応）
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 3) 実食投稿テーブル（承認制・アカウント紐付け）
-- ============================================================
create table if not exists public.ramen_posts (
  id uuid primary key default gen_random_uuid(),
  shop_id text,                                  -- 既存店舗のID。新規店舗投稿では null
  user_id uuid references auth.users (id) on delete set null,
  nickname text,                                 -- 旧仕様。表示は profiles.display_name を優先
  menu_name text not null,
  price_yen integer,
  body text,
  scene_tags text[] default '{}',
  image_url text,
  image_path text,
  is_public boolean not null default true,
  shop_name_manual text,                         -- 新規店舗として投稿された店名
  shop_area_manual text,                         -- 新規店舗のエリア
  shop_merge_status text not null default 'unmatched', -- unmatched | matched
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

-- 既存DB向けの追加（新カラム・shop_id を nullable に）
alter table public.ramen_posts alter column shop_id drop not null;
alter table public.ramen_posts add column if not exists user_id uuid references auth.users (id) on delete set null;
alter table public.ramen_posts add column if not exists is_public boolean not null default true;
alter table public.ramen_posts add column if not exists shop_name_manual text;
alter table public.ramen_posts add column if not exists shop_area_manual text;
alter table public.ramen_posts add column if not exists shop_merge_status text not null default 'unmatched';

create index if not exists ramen_posts_shop_status_idx on public.ramen_posts (shop_id, status);
create index if not exists ramen_posts_status_created_idx on public.ramen_posts (status, created_at desc);
create index if not exists ramen_posts_user_idx on public.ramen_posts (user_id, created_at desc);
create index if not exists ramen_posts_merge_idx on public.ramen_posts (shop_merge_status);

-- ============================================================
-- 4) RLS（行レベルセキュリティ）
--    書き込み・承認・画像アップロードは server action の service role 経由（RLSをバイパス）。
--    ここでは「読み取り」を中心にポリシーを定義する。
-- ============================================================

-- profiles: 公開読み取り / 本人のみ作成・更新
alter table public.profiles enable row level security;
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public"
  on public.profiles for select
  to anon, authenticated
  using (true);
drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self insert"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ramen_posts: 承認済み かつ 公開 のみ誰でも読める / 自分の投稿は本人が読める
alter table public.ramen_posts enable row level security;
drop policy if exists "approved posts are public" on public.ramen_posts;
create policy "approved posts are public"
  on public.ramen_posts for select
  to anon, authenticated
  using (status = 'approved' and is_public = true);
drop policy if exists "own posts readable" on public.ramen_posts;
create policy "own posts readable"
  on public.ramen_posts for select
  to authenticated
  using (auth.uid() = user_id);
-- insert/update/delete の anon/authenticated ポリシーは作らない。
-- 投稿作成（認証チェック込み）・承認・却下・統合はすべて server action の service role が行う。

-- ramen_shops: 公開読み取り
alter table public.ramen_shops enable row level security;
drop policy if exists "shops are public" on public.ramen_shops;
create policy "shops are public"
  on public.ramen_shops for select
  to anon, authenticated
  using (true);

-- ============================================================
-- 5) Storage バケット（投稿画像）
-- ============================================================
insert into storage.buckets (id, name, public)
values ('ramen-post-images', 'ramen-post-images', true)
on conflict (id) do nothing;

drop policy if exists "post images are public" on storage.objects;
create policy "post images are public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'ramen-post-images');
