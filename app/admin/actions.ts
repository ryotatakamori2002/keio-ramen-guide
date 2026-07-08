"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, isSupabaseReady } from "@/lib/supabase";
import { insertWithColumnFallback } from "@/lib/db-utils";

const ADMIN_COOKIE = "krg_admin";

export interface AdminLoginState {
  ok: boolean;
  message: string;
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === "1";
}

export async function adminLogin(_prev: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false, message: "ADMIN_PASSWORD が未設定です。.env に設定してください。" };
  }
  if (password !== expected) {
    return { ok: false, message: "パスワードが違います。" };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  revalidatePath("/admin");
  return { ok: true, message: "ログインしました。" };
}

export async function adminLogout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  revalidatePath("/admin");
}

async function setStatus(id: string, status: "approved" | "rejected"): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  if (!isSupabaseReady()) return;
  const db = getSupabaseAdmin();
  if (!db) return;
  await db
    .from("ramen_posts")
    .update({ status, approved_at: status === "approved" ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/admin");
}

export async function approvePost(formData: FormData): Promise<void> {
  await setStatus(String(formData.get("id") ?? ""), "approved");
}

export async function rejectPost(formData: FormData): Promise<void> {
  await setStatus(String(formData.get("id") ?? ""), "rejected");
}

// ---- 店舗掲載リクエストの処理 ----

// リクエストを見送る（rejected にするだけ。データは残す）
export async function rejectShopRequest(formData: FormData): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const db = getSupabaseAdmin();
  if (!db) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await db.from("ramen_shop_requests").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin");
}

// リクエストを採用し、needs_review の店舗として ramen_shops に追加する。
// 追加後は /shops・/map・/post の候補に「要確認」ラベル付きで並ぶ。
export async function acceptShopRequest(formData: FormData): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const db = getSupabaseAdmin();
  if (!db) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data: req } = await db.from("ramen_shop_requests").select("*").eq("id", id).maybeSingle();
  if (!req) return;

  const shopId = `req-${String(req.id).slice(0, 8)}`;
  const name = String(req.shop_name ?? "").trim();
  if (!name) return;

  const payload: Record<string, unknown> = {
    id: shopId,
    name,
    area: (req.area as string) || "その他",
    station: (req.station as string) || null,
    genres: req.genre ? [String(req.genre)] : [],
    google_maps_url: (req.map_url as string) || null,
    selection_reason: (req.reason as string) || null,
    publish_status: "needs_review",
    data_confidence: "low",
    // 以下は schema.sql 適用後に有効になる拡張カラム
    area_type: "other",
    source_type: "user_request",
    editorial_priority: "could",
  };
  const { error } = await insertWithColumnFallback(db, "ramen_shops", payload, [
    "area_type",
    "source_type",
    "editorial_priority",
  ]);
  if (error) {
    console.error("acceptShopRequest insert failed:", { code: error.code, message: error.message });
    return;
  }
  await db.from("ramen_shop_requests").update({ status: "accepted" }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/shops");
  revalidatePath("/map");
}
