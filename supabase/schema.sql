-- Keio Ramen Guide — Supabase スキーマ
-- 実行: Supabase ダッシュボード > SQL Editor にこの内容を貼って Run。
-- もしくは: supabase db push / psql で適用。
-- 冪等（何度実行しても安全）。投稿が保存できない時（permission denied / 42501）も
-- このファイルを丸ごと再実行すれば直る。

-- ============================================================
-- 0) 権限の復旧
--    Supabaseの無料プロジェクトはpause→復帰でテーブル権限（GRANT）が
--    失われることがあり、その状態では service_role ですら
--    「42501 permission denied for table ramen_posts」でinsertに失敗する。
--    ここでSupabase標準の権限を張り直す（RLSは3)で別途制御している）。
-- ============================================================
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant select on all tables in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant select on tables to anon, authenticated;

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

-- 店を「コード固定」ではなく運用で追加できるようにするための拡張カラム（冪等）。
-- area_type: campus（キャンパス周辺）/ life（生活圏）/ other
-- source_type: seed（静的データ）/ admin（運営追加）/ user_request（リクエスト経由）
alter table public.ramen_shops add column if not exists area_type text not null default 'campus';
alter table public.ramen_shops add column if not exists campus_area text;
alter table public.ramen_shops add column if not exists address text;
alter table public.ramen_shops add column if not exists latitude double precision;
alter table public.ramen_shops add column if not exists longitude double precision;
alter table public.ramen_shops add column if not exists first_visit_price integer;
alter table public.ramen_shops add column if not exists beginner_note text;
alter table public.ramen_shops add column if not exists order_note text;
alter table public.ramen_shops add column if not exists image_url text;
alter table public.ramen_shops add column if not exists thumbnail_image_url text;
alter table public.ramen_shops add column if not exists editorial_priority text not null default 'could';
alter table public.ramen_shops add column if not exists source_type text not null default 'admin';

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

-- 投稿者の任意属性（/insights の集計用。すべて任意・個人が分かる形では表示しない）
alter table public.ramen_posts add column if not exists author_affiliation text;
alter table public.ramen_posts add column if not exists author_campus text;
alter table public.ramen_posts add column if not exists author_faculty text;
alter table public.ramen_posts add column if not exists author_grade text;
alter table public.ramen_posts add column if not exists author_gender text;
alter table public.ramen_posts add column if not exists author_mbti text;

-- ============================================================
-- 2.5) 店舗追加リクエスト（ログイン不要・すぐには公開しない）
--      管理者が /admin で確認し、採用したら ramen_shops に追加する。
-- ============================================================
create table if not exists public.ramen_shop_requests (
  id uuid primary key default gen_random_uuid(),
  shop_name text not null,
  area text,
  station text,
  map_url text,
  genre text,
  reason text,
  requester_name text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now()
);

create index if not exists ramen_shop_requests_status_idx on public.ramen_shop_requests (status, created_at desc);

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

-- 店舗リクエストは公開読み取り不要。書き込み・確認とも service role（サーバー）経由のみ。
alter table public.ramen_shop_requests enable row level security;

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

-- ============================================================
-- 5) 権限の再適用（このファイルで新規作成されたテーブルにも確実に効かせる）
-- ============================================================
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant select on all tables in schema public to anon, authenticated;
