import "server-only";
import { getSupabaseAdmin } from "./supabase";
import { isMissingTableError } from "./db-utils";

export interface ShopRequest {
  id: string;
  shopName: string;
  area: string | null;
  station: string | null;
  mapUrl: string | null;
  genre: string | null;
  reason: string | null;
  requesterName: string | null;
  status: string;
  createdAt: string;
}

// 承認待ちの掲載リクエスト（/admin用）。テーブル未作成・未設定なら空配列。
export async function getPendingShopRequests(): Promise<ShopRequest[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("ramen_shop_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) {
    if (!isMissingTableError(error)) console.error("getPendingShopRequests failed:", error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    id: String(row.id),
    shopName: String(row.shop_name ?? ""),
    area: (row.area as string) ?? null,
    station: (row.station as string) ?? null,
    mapUrl: (row.map_url as string) ?? null,
    genre: (row.genre as string) ?? null,
    reason: (row.reason as string) ?? null,
    requesterName: (row.requester_name as string) ?? null,
    status: String(row.status ?? "pending"),
    createdAt: String(row.created_at ?? ""),
  }));
}
