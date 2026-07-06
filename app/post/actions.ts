"use server";

import { randomUUID } from "crypto";
import { getShopById } from "@/lib/shops";
import { getSupabaseAdmin, isSupabaseReady, STORAGE_BUCKET } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth/server";
import { ensureProfile } from "@/app/auth/actions";
import { SCENE_OPTIONS } from "@/lib/quiz";

export interface PostFormState {
  ok: boolean;
  message: string;
}

const VALID_SCENES = new Set(SCENE_OPTIONS.map((o) => o.value));
const VALID_AREAS = new Set(["日吉", "三田", "横浜", "その他"]);
const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6MB

export async function submitPost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  if (!isSupabaseReady()) {
    return { ok: false, message: "Supabase設定後に投稿機能が有効になります。" };
  }
  const db = getSupabaseAdmin();
  if (!db) return { ok: false, message: "Supabase設定後に投稿機能が有効になります。" };

  // 投稿はログイン必須
  const user = await getSessionUser();
  if (!user) return { ok: false, message: "投稿するにはログインが必要です。" };
  // profile を確実に用意（投稿者表示のため）
  await ensureProfile();

  const shopId = String(formData.get("shopId") ?? "").trim();
  const newShopName = String(formData.get("newShopName") ?? "").trim();
  const newShopArea = String(formData.get("newShopArea") ?? "").trim();
  const menuName = String(formData.get("menuName") ?? "").trim();
  const nickname = String(formData.get("nickname") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const newShopMemo = String(formData.get("newShopMemo") ?? "").trim();
  const finalBody = body || newShopMemo || null;
  const priceRaw = String(formData.get("priceYen") ?? "").trim();
  const isPublic = formData.get("isPublic") !== null; // チェックあり=公開（既定チェック）
  const sceneTags = formData
    .getAll("scene")
    .map((v) => String(v))
    .filter((v) => VALID_SCENES.has(v as never));

  // 店舗の決定：既存店舗ID か、新規店舗（店名＋エリア）
  let resolvedShopId: string | null = null;
  let shopNameManual: string | null = null;
  let shopAreaManual: string | null = null;
  let mergeStatus = "unmatched";

  if (shopId && getShopById(shopId)) {
    resolvedShopId = shopId;
    mergeStatus = "matched";
  } else if (newShopName) {
    shopNameManual = newShopName;
    shopAreaManual = VALID_AREAS.has(newShopArea) ? newShopArea : "その他";
    mergeStatus = "unmatched";
  } else {
    return { ok: false, message: "店舗を選ぶか、新しい店として入力してください。" };
  }

  if (!menuName) {
    return { ok: false, message: "食べた一杯（メニュー名）を入力してください。" };
  }
  const priceYen = priceRaw === "" ? null : Number.parseInt(priceRaw, 10);
  if (priceYen !== null && (Number.isNaN(priceYen) || priceYen < 0 || priceYen > 100000)) {
    return { ok: false, message: "金額は正しい数字で入力してください。" };
  }

  // 画像（任意）
  let imageUrl: string | null = null;
  let imagePath: string | null = null;
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      return { ok: false, message: "画像ファイルを選んでください。" };
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return { ok: false, message: "画像サイズが大きすぎます（6MBまで）。" };
    }
    const path = `posts/${randomUUID()}.jpg`;
    const { error: upErr } = await db.storage
      .from(STORAGE_BUCKET)
      .upload(path, image, { contentType: image.type, upsert: false });
    if (upErr) {
      return { ok: false, message: "画像のアップロードに失敗しました。時間をおいて試してください。" };
    }
    imagePath = path;
    imageUrl = db.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const { error } = await db.from("ramen_posts").insert({
    shop_id: resolvedShopId,
    user_id: user.id,
    nickname: nickname || null,
    menu_name: menuName,
    price_yen: priceYen,
    body: finalBody,
    scene_tags: sceneTags,
    image_url: imageUrl,
    image_path: imagePath,
    is_public: isPublic,
    shop_name_manual: shopNameManual,
    shop_area_manual: shopAreaManual,
    shop_merge_status: mergeStatus,
    status: "pending",
  });

  if (error) {
    return { ok: false, message: "投稿の保存に失敗しました。時間をおいて試してください。" };
  }

  return { ok: true, message: "投稿ありがとうございます。確認後に掲載されます。" };
}
