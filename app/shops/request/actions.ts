"use server";

import { getSupabaseAdmin, isSupabaseReady } from "@/lib/supabase";
import { isMissingTableError } from "@/lib/db-utils";
import { copy } from "@/content/site-copy";

export interface RequestFormState {
  ok: boolean;
  message: string;
}

// 店舗の掲載リクエスト。ログイン不要・すぐには公開しない。
// ramen_shop_requests に pending で保存し、/admin で確認してから店舗化する。
export async function submitShopRequest(_prev: RequestFormState, formData: FormData): Promise<RequestFormState> {
  try {
    return await handleRequest(formData);
  } catch (err) {
    console.error("submitShopRequest failed:", err);
    return { ok: false, message: copy.request.error };
  }
}

async function handleRequest(formData: FormData): Promise<RequestFormState> {
  if (!isSupabaseReady()) return { ok: false, message: copy.request.disabled };
  const db = getSupabaseAdmin();
  if (!db) return { ok: false, message: copy.request.disabled };

  const shopName = String(formData.get("shopName") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const station = String(formData.get("station") ?? "").trim();
  const mapUrl = String(formData.get("mapUrl") ?? "").trim();
  const genre = String(formData.get("genre") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const requester = String(formData.get("requester") ?? "").trim();

  if (!shopName) return { ok: false, message: "店名を入力してください。" };
  if (shopName.length > 60) return { ok: false, message: "店名が長すぎます。" };
  if (mapUrl && !/^https?:\/\//.test(mapUrl)) {
    return { ok: false, message: "Google MapsのURLは http(s) で始まるリンクを入力してください。" };
  }

  const { error } = await db.from("ramen_shop_requests").insert({
    shop_name: shopName,
    area: area || null,
    station: station || null,
    map_url: mapUrl || null,
    genre: genre || null,
    reason: reason ? reason.slice(0, 500) : null,
    requester_name: requester ? requester.slice(0, 30) : null,
    status: "pending",
  });

  if (error) {
    console.error("submitShopRequest insert failed:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    if (isMissingTableError(error)) {
      // schema.sql（ramen_shop_requests）が本番DBに未適用
      console.error("submitShopRequest: run supabase/schema.sql to create ramen_shop_requests.");
      return { ok: false, message: copy.request.disabled };
    }
    return { ok: false, message: copy.request.error };
  }

  return { ok: true, message: copy.request.successBody };
}
