import "server-only";
import type { PostAuthor, PostMeta, PostStatus, Profile, RamenPost, SceneTag } from "./types";
import { getSupabaseAdmin, isSupabaseReady } from "./supabase";

// DBの行（snake_case）をアプリの RamenPost（camelCase）に変換する。author は後で差し込む。
function mapRow(row: Record<string, unknown>): RamenPost {
  return {
    id: String(row.id),
    shopId: row.shop_id ? String(row.shop_id) : null,
    userId: row.user_id ? String(row.user_id) : null,
    nickname: (row.nickname as string) ?? null,
    menuName: String(row.menu_name ?? ""),
    priceYen: row.price_yen == null ? null : Number(row.price_yen),
    body: (row.body as string) ?? null,
    sceneTags: Array.isArray(row.scene_tags) ? (row.scene_tags as SceneTag[]) : [],
    imageUrl: (row.image_url as string) ?? null,
    imagePath: (row.image_path as string) ?? null,
    isPublic: row.is_public !== false,
    shopNameManual: (row.shop_name_manual as string) ?? null,
    shopAreaManual: (row.shop_area_manual as string) ?? null,
    shopMergeStatus: (row.shop_merge_status as string) ?? "unmatched",
    status: (row.status as PostStatus) ?? "pending",
    createdAt: String(row.created_at ?? ""),
    approvedAt: (row.approved_at as string) ?? null,
    author: null,
  };
}

// user_id 群から profiles を引いて投稿に投稿者情報を差し込む。
async function attachAuthors(posts: RamenPost[]): Promise<RamenPost[]> {
  const db = getSupabaseAdmin();
  const ids = Array.from(new Set(posts.map((p) => p.userId).filter((v): v is string => Boolean(v))));
  if (!db || ids.length === 0) return posts;
  const { data } = await db.from("profiles").select("id, handle, display_name, avatar_url").in("id", ids);
  if (!data) return posts;
  const byId = new Map<string, PostAuthor>();
  for (const r of data) {
    byId.set(String(r.id), {
      handle: String(r.handle),
      displayName: String(r.display_name),
      avatarUrl: (r.avatar_url as string) ?? null,
    });
  }
  return posts.map((p) => ({ ...p, author: p.userId ? byId.get(p.userId) ?? null : null }));
}

// 指定店舗の承認済み・公開投稿（新しい順）。Supabase未設定なら空配列。
export async function getApprovedPostsByShop(shopId: string): Promise<RamenPost[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("ramen_posts")
    .select("*")
    .eq("shop_id", shopId)
    .eq("status", "approved")
    .eq("is_public", true)
    .order("approved_at", { ascending: false });
  if (error || !data) return [];
  return attachAuthors(data.map(mapRow));
}

// 全店分の投稿サマリ（件数・最新写真）。/shops のカード用。
export async function getApprovedPostMeta(): Promise<Record<string, PostMeta>> {
  const db = getSupabaseAdmin();
  if (!db) return {};
  const { data, error } = await db
    .from("ramen_posts")
    .select("shop_id, image_url, approved_at")
    .eq("status", "approved")
    .eq("is_public", true)
    .not("shop_id", "is", null)
    .order("approved_at", { ascending: false });
  if (error || !data) return {};
  const meta: Record<string, PostMeta> = {};
  for (const row of data) {
    const id = String(row.shop_id);
    if (!meta[id]) meta[id] = { count: 0 };
    meta[id].count += 1;
    if (!meta[id].latestImageUrl && row.image_url) meta[id].latestImageUrl = String(row.image_url);
  }
  return meta;
}

// 最近の承認済み・公開投稿（トップ用）。
export async function getRecentApprovedPosts(limit = 6): Promise<RamenPost[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("ramen_posts")
    .select("*")
    .eq("status", "approved")
    .eq("is_public", true)
    .order("approved_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return attachAuthors(data.map(mapRow));
}

// 承認待ちの投稿（管理画面用）。
export async function getPendingPosts(): Promise<RamenPost[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("ramen_posts")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return attachAuthors(data.map(mapRow));
}

// 指定ユーザーの投稿（本人の /me 用。全ステータスを新しい順で）。
export async function getPostsByUser(userId: string): Promise<RamenPost[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("ramen_posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return attachAuthors(data.map(mapRow));
}

// 公開プロフィール（/users/[handle] 用）の承認済み・公開投稿。
export async function getPublicPostsByUser(userId: string): Promise<RamenPost[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("ramen_posts")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "approved")
    .eq("is_public", true)
    .order("approved_at", { ascending: false });
  if (error || !data) return [];
  return attachAuthors(data.map(mapRow));
}

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    handle: String(row.handle),
    displayName: String(row.display_name),
    avatarUrl: (row.avatar_url as string) ?? null,
    bio: (row.bio as string) ?? null,
  };
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data } = await db.from("profiles").select("*").eq("id", id).maybeSingle();
  return data ? mapProfile(data) : null;
}

export async function getProfileByHandle(handle: string): Promise<Profile | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data } = await db.from("profiles").select("*").eq("handle", handle).maybeSingle();
  return data ? mapProfile(data) : null;
}

export { isSupabaseReady };
