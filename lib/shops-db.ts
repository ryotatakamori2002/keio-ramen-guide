import "server-only";
import type { Shop } from "./types";
import { getSupabaseAdmin } from "./supabase";

// Supabase の ramen_shops を既存の Shop 型へ写像する。
// DBの店は編集項目（寸評・指標など）が最小限のことがあるため、
// UIが破綻しない中立の既定値で埋める。静的 lib/shops.ts はseedとして残り、
// 同じidがDBにあればDB側を優先する（lib/catalog.ts でマージ）。

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}

function mapRow(row: Record<string, unknown>): Shop | null {
  const id = str(row.id);
  const name = str(row.name);
  const area = str(row.area);
  if (!id || !name || !area) return null;

  const genres = Array.isArray(row.genres) && row.genres.length > 0 ? (row.genres as string[]) : ["ラーメン"];
  const publishStatus = (str(row.publish_status) as Shop["publishStatus"]) ?? "needs_review";
  const dataConfidence = (str(row.data_confidence) as Shop["dataConfidence"]) ?? "medium";
  const editorialPriority = (str(row.editorial_priority) as Shop["editorialPriority"]) ?? "could";
  const price = typeof row.first_visit_price === "number" ? row.first_visit_price : null;

  return {
    id,
    name,
    area,
    station: str(row.station) ?? area,
    city: str(row.address) ?? "",
    prefecture: "",
    communityTags: [],
    targetUniversities: ["慶應義塾大学"],
    genres,
    sceneTags: [],
    images: [],
    primaryImageUrl: str(row.thumbnail_image_url) ?? str(row.image_url),
    heroImageUrl: str(row.image_url),
    thumbnailImageUrl: str(row.thumbnail_image_url) ?? str(row.image_url),
    squareImageUrl: undefined,
    imageAlt: str(row.image_url) ? `${name}のラーメン` : undefined,
    photoStatus: str(row.image_url) ? "owned" : "none",
    photoNeeded: !str(row.image_url),
    budgetMin: price ?? 800,
    budgetMax: price ?? 1200,
    firstVisitOrder: str(row.first_visit_order) ?? genres[0],
    firstVisitPrice: price ?? 1000,
    expectedSpendNote: str(row.expected_spend_note) ?? "",
    priceConfidence: "approximate",
    visualTone: "other",
    // 指標は未評価なので中立値。投稿・確認が進んだら更新する
    richness: 3,
    lightness: 3,
    volume: 3,
    beginnerFriendly: 3,
    soloFriendly: 3,
    friendFriendly: 3,
    queueLevel: 3,
    speedLevel: 3,
    lateNight: false,
    keioStudentScore: 3,
    nearness: 3,
    selectionReason: str(row.selection_reason) ?? "投稿・リクエストから追加された店。情報は随時追記します。",
    avoidIf: str(row.avoid_if) ?? "",
    keioUseCase: "",
    queueAdvice: "",
    soloAdvice: "",
    beginnerAdvice: str(row.beginner_note) ?? "",
    tasteNotes: "",
    atmosphereNotes: "",
    rulesNotes: str(row.order_note) ?? "",
    recommendedFor: [],
    accessNote: str(row.address) ?? "",
    googleMapsUrl:
      str(row.google_maps_url) ??
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${area}`)}`,
    officialUrl: undefined,
    dataLastChecked: str(row.updated_at)?.slice(0, 7) ?? str(row.created_at)?.slice(0, 7) ?? "",
    dataConfidence,
    dataNote: "投稿・リクエスト経由の掲載です。価格・営業時間は訪問前にGoogle Mapsでご確認ください。",
    publishStatus,
    editorialPriority,
  };
}

// ready / needs_review のDB店舗を取得。未設定・エラー・テーブル無しでは空配列（サイトは静的seedで動く）。
export async function getDbShops(): Promise<Shop[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  try {
    const { data, error } = await db
      .from("ramen_shops")
      .select("*")
      .in("publish_status", ["ready", "needs_review"]);
    if (error || !data) return [];
    return data.map(mapRow).filter((s): s is Shop => Boolean(s));
  } catch {
    return [];
  }
}
