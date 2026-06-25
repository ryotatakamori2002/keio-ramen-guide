// 1〜5の評価スケール。5が「強い/多い/高い」方向。
export type Level = 1 | 2 | 3 | 4 | 5;

// シーンタグ。診断の質問選択肢と共通のキーを使う。
export type SceneTag =
  | "after_class"
  | "gap_time"
  | "solo"
  | "with_friends"
  | "after_club"
  | "after_drinking"
  | "hearty"
  | "no_fail";

// ビジュアルの色味。写真がない店のプレースホルダーの配色とアイコン形状を決める。
export type VisualTone = "iekei" | "jiro" | "tanrei" | "mazesoba" | "tsukemen" | "miso" | "other";

// 価格情報の確からしさ。"approximate" の場合はUIに「目安」と明記する。
export type PriceConfidence = "exact" | "approximate" | "unknown";

export interface Shop {
  id: string;
  name: string;
  /** 将来エリアを拡張しやすいよう string で保持（例: "日吉" "三田" "横浜"） */
  area: string;
  station: string;
  city: string;
  prefecture: string;
  communityTags: string[];
  targetUniversities: string[];
  genres: string[];
  sceneTags: SceneTag[];
  budgetMin: number;
  budgetMax: number;
  /** 看板メニュー名（例: "ラーメン並＋ライス"） */
  signatureOrderName: string;
  /** 看板メニューの目安価格（円）。ライス等を含む現実的な一食の値段 */
  signatureOrderPrice: number;
  /** 学生視点の予算メモ（例: "ライス無料でこの値段は強い"） */
  studentBudgetNote: string;
  priceConfidence: PriceConfidence;
  /** 自前 or 許諾済みの料理写真URL。未設定ならプレースホルダーを表示 */
  imageUrl?: string;
  imageAlt?: string;
  /** 写真の出典・撮影者クレジット */
  imageCredit?: string;
  /** プレースホルダーの色味とアイコン形状 */
  visualTone: VisualTone;
  /** こってり度 */
  richness: Level;
  /** あっさり度 */
  lightness: Level;
  /** 量の多さ */
  volume: Level;
  beginnerFriendly: Level;
  soloFriendly: Level;
  friendFriendly: Level;
  /** 並びやすさ。高いほど混みやすい */
  queueLevel: Level;
  /** 回転の速さ。高いほど早い */
  speedLevel: Level;
  lateNight: boolean;
  keioStudentScore: Level;
  /** そのエリアでのアクセスの良さ（最寄駅からの近さ）。高いほど駅近・行きやすい。カードの「近さ」指標に使う */
  nearness: Level;
  /** UIに表示する正直なアクセス情報（キャンパスから電車移動が必要ならその旨を書く） */
  accessNote: string;
  /** この店を選ぶ理由。詳細ページの最上部で見せる一言 */
  whyThisShop: string;
  recommendedMenu: string;
  tasteNotes: string;
  atmosphereNotes: string;
  beginnerNotes: string;
  rulesNotes: string;
  keioNotes: string;
  recommendedFor: string[];
  googleMapsUrl: string;
  officialUrl?: string;
}
