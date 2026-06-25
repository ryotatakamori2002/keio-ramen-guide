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
  /** 最寄りキャンパスからの徒歩分（分） */
  campusWalkMin: number;
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
