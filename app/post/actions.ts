"use server";

import { randomUUID } from "crypto";
import { getShopById } from "@/lib/shops";
import { getSupabaseAdmin, isSupabaseReady, STORAGE_BUCKET } from "@/lib/supabase";
import { SCENE_OPTIONS } from "@/lib/quiz";

export interface PostFormState {
  ok: boolean;
  message: string;
}

const VALID_SCENES = new Set(SCENE_OPTIONS.map((o) => o.value));
const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6MB

export async function submitPost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  // どんな失敗でも本番500にせず、フォーム上のエラーメッセージとして返す。
  try {
    return await handleSubmit(formData);
  } catch (err) {
    console.error("submitPost failed:", err);
    return { ok: false, message: "投稿に失敗しました。時間をおいてもう一度試してください。" };
  }
}

async function handleSubmit(formData: FormData): Promise<PostFormState> {
  if (!isSupabaseReady()) {
    return { ok: false, message: "投稿機能は現在準備中です。" };
  }
  const db = getSupabaseAdmin();
  if (!db) return { ok: false, message: "投稿機能は現在準備中です。" };

  const shopId = String(formData.get("shopId") ?? "").trim();
  const menuName = String(formData.get("menuName") ?? "").trim();
  const nickname = String(formData.get("nickname") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const priceRaw = String(formData.get("priceYen") ?? "").trim();
  const sceneTags = formData
    .getAll("scene")
    .map((v) => String(v))
    .filter((v) => VALID_SCENES.has(v as never));

  if (!shopId || !getShopById(shopId)) {
    return { ok: false, message: "店舗を選んでください。" };
  }
  if (!menuName) {
    return { ok: false, message: "食べたメニュー名を入力してください。" };
  }
  const priceYen = priceRaw === "" ? null : Number.parseInt(priceRaw, 10);
  if (priceYen !== null && (Number.isNaN(priceYen) || priceYen < 0 || priceYen > 100000)) {
    return { ok: false, message: "金額は正しい数字で入力してください。" };
  }

  // 画像（任意）。あればStorageにアップロードして公開URLを得る。
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
      // bucket未作成・権限不足など。DB insertに進む前にここで止める。
      console.error("submitPost image upload failed:", upErr);
      return { ok: false, message: "画像のアップロードに失敗しました。時間をおいてもう一度試してください。" };
    }
    imagePath = path;
    imageUrl = db.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const { error } = await db.from("ramen_posts").insert({
    shop_id: shopId,
    nickname: nickname || null,
    menu_name: menuName,
    price_yen: priceYen,
    body: body || null,
    scene_tags: sceneTags,
    image_url: imageUrl,
    image_path: imagePath,
    status: "pending",
  });

  if (error) {
    console.error("submitPost insert failed:", error);
    return { ok: false, message: "投稿の保存に失敗しました。時間をおいてもう一度試してください。" };
  }

  return { ok: true, message: "投稿ありがとうございます。確認後に掲載されます。" };
}
