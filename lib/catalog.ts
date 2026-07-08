import "server-only";
import type { Shop } from "./types";
import { SHOPS } from "./shops";
import { getDbShops } from "./shops-db";

// 店舗カタログ＝静的seed（lib/shops.ts）＋ Supabaseの追加店舗のマージ。
// - 同じidはDB側を優先（seedをDBで上書き運用できる）
// - Supabase未設定・エラー時はseedだけで動く（buildも表示も壊れない）
// - /shops・/shops/[id]・/post・/map・トップの件数はここを使う
export async function getCatalogShops(): Promise<Shop[]> {
  const dbShops = await getDbShops();
  if (dbShops.length === 0) return SHOPS;
  const merged = new Map<string, Shop>(SHOPS.map((s) => [s.id, s]));
  for (const shop of dbShops) merged.set(shop.id, shop);
  return Array.from(merged.values());
}

export async function getCatalogShopById(id: string): Promise<Shop | undefined> {
  const shops = await getCatalogShops();
  return shops.find((s) => s.id === id);
}

export async function getCatalogVisibleShops(): Promise<Shop[]> {
  return (await getCatalogShops()).filter((s) => s.publishStatus !== "candidate");
}
