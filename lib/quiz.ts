import type { SceneTag } from "./types";

export type LocationAnswer = "日吉" | "三田" | "横浜" | "any";
export type SceneAnswer = SceneTag;
export type TasteAnswer =
  | "iekei"
  | "jiro"
  | "tanrei"
  | "shoyu"
  | "shio"
  | "miso"
  | "mazesoba"
  | "tsukemen"
  | "unknown";
export type RichnessAnswer = "light" | "normal" | "rich" | "extreme";
export type VolumeAnswer = "light" | "normal" | "hearty";
export type BeginnerAnswer = "beginner" | "quirks_ok" | "expert_ok";
export type QueueAnswer = "avoid" | "fifteen_ok" | "can_queue";

export interface QuizAnswers {
  location: LocationAnswer;
  scene: SceneAnswer;
  taste: TasteAnswer;
  richness: RichnessAnswer;
  volume: VolumeAnswer;
  beginner: BeginnerAnswer;
  queue: QueueAnswer;
}

export interface QuizOption<T extends string> {
  value: T;
  label: string;
}

export const LOCATION_OPTIONS: QuizOption<LocationAnswer>[] = [
  { value: "日吉", label: "日吉" },
  { value: "三田", label: "三田" },
  { value: "横浜", label: "横浜" },
  { value: "any", label: "どこでもいい" },
];

export const SCENE_OPTIONS: QuizOption<SceneAnswer>[] = [
  { value: "after_class", label: "授業後" },
  { value: "gap_time", label: "空きコマ" },
  { value: "solo", label: "一人飯" },
  { value: "with_friends", label: "友達と" },
  { value: "after_club", label: "サークル後" },
  { value: "after_drinking", label: "飲み後" },
  { value: "hearty", label: "がっつり" },
  { value: "no_fail", label: "失敗したくない" },
];

export const TASTE_OPTIONS: QuizOption<TasteAnswer>[] = [
  { value: "iekei", label: "家系" },
  { value: "jiro", label: "二郎系" },
  { value: "tanrei", label: "淡麗" },
  { value: "shoyu", label: "醤油" },
  { value: "shio", label: "塩" },
  { value: "miso", label: "味噌" },
  { value: "mazesoba", label: "まぜそば" },
  { value: "tsukemen", label: "つけ麺" },
  { value: "unknown", label: "よくわからない" },
];

export const RICHNESS_OPTIONS: QuizOption<RichnessAnswer>[] = [
  { value: "light", label: "あっさり" },
  { value: "normal", label: "普通" },
  { value: "rich", label: "こってり" },
  { value: "extreme", label: "限界まで重い" },
];

export const VOLUME_OPTIONS: QuizOption<VolumeAnswer>[] = [
  { value: "light", label: "軽め" },
  { value: "normal", label: "普通" },
  { value: "hearty", label: "腹パン" },
];

export const BEGINNER_OPTIONS: QuizOption<BeginnerAnswer>[] = [
  { value: "beginner", label: "初心者向け" },
  { value: "quirks_ok", label: "クセありOK" },
  { value: "expert_ok", label: "玄人向けOK" },
];

export const QUEUE_OPTIONS: QuizOption<QueueAnswer>[] = [
  { value: "avoid", label: "並びたくない" },
  { value: "fifteen_ok", label: "15分OK" },
  { value: "can_queue", label: "並べる" },
];

/** 味の好み回答 → 店舗データの genres タグへのマッピング */
export const TASTE_TO_GENRE: Record<TasteAnswer, string | null> = {
  iekei: "家系",
  jiro: "二郎系",
  tanrei: "淡麗",
  shoyu: "醤油",
  shio: "塩",
  miso: "味噌",
  mazesoba: "まぜそば",
  tsukemen: "つけ麺",
  unknown: null,
};

export const DEFAULT_QUIZ_ANSWERS: QuizAnswers = {
  location: "any",
  scene: "no_fail",
  taste: "unknown",
  richness: "normal",
  volume: "normal",
  beginner: "beginner",
  queue: "fifteen_ok",
};
