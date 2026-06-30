import "server-only";
import type { PostMeta, PostStatus, RamenPost, SceneTag } from "./types";
import { getSupabaseAdmin, isSupabaseReady } from "./supabase";

// DBの行（snake_case）をアプリの RamenPost（camelCase）に変換する。
function mapRow(row: Record<string, unknown>): RamenPost {
  return {
    id: String(row.id),
    shopId: String(row.shop_id),
    nickname: (row.nickname as string) ?? null,
    menuName: String(row.menu_name ?? ""),
    priceYen: row.price_yen == null ? null : Number(row.price_yen),
    body: (row.body as string) ?? null,
    sceneTags: Array.isArray(row.scene_tags) ? (row.scene_tags as SceneTag[]) : [],
    imageUrl: (row.image_url as string) ?? null,
    imagePath: (row.image_path as string) ?? null,
    status: (row.status as PostStatus) ?? "pending",
    createdAt: String(row.created_at ?? ""),
    approvedAt: (row.approved_at as string) ?? null,
  };
}

// 指定店舗の承認済み投稿（新しい順）。Supabase未設定なら空配列。
export async function getApprovedPostsByShop(shopId: string): Promise<RamenPost[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("ramen_posts")
    .select("*")
    .eq("shop_id", shopId)
    .eq("status", "approved")
    .order("approved_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapRow);
}

// 全店分の投稿サマリ（件数・最新写真）。/shops のカード用。未設定なら空。
export async function getApprovedPostMeta(): Promise<Record<string, PostMeta>> {
  const db = getSupabaseAdmin();
  if (!db) return {};
  const { data, error } = await db
    .from("ramen_posts")
    .select("shop_id, image_url, approved_at")
    .eq("status", "approved")
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

// 最近の承認済み投稿（トップ用）。
export async function getRecentApprovedPosts(limit = 6): Promise<RamenPost[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("ramen_posts")
    .select("*")
    .eq("status", "approved")
    .order("approved_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(mapRow);
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
  return data.map(mapRow);
}

export { isSupabaseReady };
