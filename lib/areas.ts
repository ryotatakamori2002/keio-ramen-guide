// エリアの台帳。
// Keio Ramen Guide は「固定の3エリア」ではなく、慶應のキャンパス周辺（campus）と
// 慶應生がよく使う生活圏（life）を、投稿とリクエストで増やしていく。
// - live: true  … 店舗を掲載中
// - live: false … 追加予定（Coming soon）。正直に「まだ無い」と見せ、リクエスト導線につなぐ
// shop.area の値はこの id と一致させる（例: "日吉" / "三田" / "横浜"）。

export type AreaType = "campus" | "life";

export interface AreaInfo {
  id: string;
  name: string;
  en: string;
  type: AreaType;
  live: boolean;
  /** 一言（掲載中エリアは文脈、追加予定エリアは対象の説明） */
  note: string;
}

export const AREAS: AreaInfo[] = [
  // --- キャンパス周辺（Core Campus Areas）---
  { id: "日吉", name: "日吉", en: "HIYOSHI", type: "campus", live: true, note: "日吉キャンパス" },
  { id: "三田", name: "三田・田町", en: "MITA / TAMACHI", type: "campus", live: true, note: "三田キャンパス" },
  { id: "矢上", name: "矢上", en: "YAGAMI", type: "campus", live: false, note: "理工学部キャンパス" },
  { id: "信濃町", name: "信濃町", en: "SHINANOMACHI", type: "campus", live: false, note: "医学部・病院" },
  { id: "湘南藤沢", name: "湘南藤沢 / SFC", en: "SFC", type: "campus", live: false, note: "総合政策・環境情報" },
  { id: "芝共立", name: "芝共立", en: "SHIBA-KYORITSU", type: "campus", live: false, note: "薬学部キャンパス" },

  // --- 生活圏（Student Life Areas）---
  { id: "横浜", name: "横浜", en: "YOKOHAMA", type: "life", live: true, note: "東横線の主要ターミナル" },
  { id: "渋谷", name: "渋谷", en: "SHIBUYA", type: "life", live: false, note: "遊び・乗り換え" },
  { id: "武蔵小杉", name: "武蔵小杉", en: "MUSASHI-KOSUGI", type: "life", live: false, note: "東横線・目黒線" },
  { id: "綱島", name: "綱島", en: "TSUNASHIMA", type: "life", live: false, note: "日吉のとなり" },
  { id: "新宿", name: "新宿", en: "SHINJUKU", type: "life", live: false, note: "遊び・乗り換え" },
];

export const LIVE_AREAS = AREAS.filter((a) => a.live);
export const UPCOMING_AREAS = AREAS.filter((a) => !a.live);

/** /shops や /map の表示順（掲載中エリアの並び） */
export const LIVE_AREA_ORDER = LIVE_AREAS.map((a) => a.id);

export function getAreaInfo(id: string): AreaInfo | undefined {
  return AREAS.find((a) => a.id === id);
}
