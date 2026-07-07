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

// 写真がない店のプレースホルダーの色味（ごく薄いティント）を決める。
export type VisualTone = "iekei" | "jiro" | "tanrei" | "mazesoba" | "tsukemen" | "miso" | "other";

// 価格情報の確からしさ。"approximate" の場合はUIに「目安」と明記する。
export type PriceConfidence = "exact" | "approximate" | "unknown";

// 店舗情報全体の信頼度。実在・営業状況・価格などの確かさ。
export type DataConfidence = "high" | "medium" | "low";

// 公開ステータス。本公開候補（ready）/ 要確認（needs_review）/ 調査候補（candidate）。
// ready: トップ・用途別棚・診断に出してよい。
// needs_review: /shops には出すが棚には出さない。詳細で「公開前に要確認」を出す。
// candidate: 初期表示では非表示。「調査候補を含める」をONにした時だけ出す。
export type PublishStatus = "ready" | "needs_review" | "candidate";

// 編集上の優先度。棚やトップで前に出す強さ。
export type EditorialPriority = "must" | "should" | "could";

// 慶應生の実食投稿。承認制（pending → approved/rejected）。
export type PostStatus = "pending" | "approved" | "rejected";

export interface RamenPost {
  id: string;
  shopId: string;
  nickname: string | null;
  menuName: string;
  priceYen: number | null;
  body: string | null;
  sceneTags: SceneTag[];
  imageUrl: string | null;
  imagePath: string | null;
  status: PostStatus;
  createdAt: string;
  approvedAt: string | null;
}

// /shops カードに出す、店ごとの投稿サマリ。
export interface PostMeta {
  count: number;
  latestImageUrl?: string;
}

// 写真の状態。無断転載はしないため、許諾の取れた写真だけを provided/owned/official_permission にする。
export type PhotoStatus = "none" | "placeholder" | "provided" | "owned" | "official_permission";

// 1枚の写真。掲載は permissionConfirmed が true のものだけ。
export interface ShopImage {
  url: string;
  alt: string;
  /** 撮影者・出典のクレジット */
  credit: string;
  sourceType: "owned" | "friend_provided" | "official_permission";
  /** 掲載許可が取れているか。false の写真は表示しない */
  permissionConfirmed: boolean;
}

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

  // --- 写真（無断転載しない設計） ---
  images: ShopImage[];
  /** 表示に使うメイン写真URL。permissionConfirmed な写真がある時だけ設定 */
  primaryImageUrl?: string;
  /** 詳細・Heroで大きく使う横長写真（/images/shops/{id}/hero.jpg） */
  heroImageUrl?: string;
  /** 一覧サムネ用（/images/shops/{id}/thumb.jpg） */
  thumbnailImageUrl?: string;
  /** 正方形トリミング（/images/shops/{id}/square.jpg） */
  squareImageUrl?: string;
  /** 写真のalt（一杯の内容を書く） */
  imageAlt?: string;
  photoStatus: PhotoStatus;
  /** まだ掲載できる写真がなく、募集・撮影が必要か */
  photoNeeded: boolean;
  /** 写真をどう集めるかのメモ（自分で撮る / 友達に依頼 / 店に許諾依頼 など） */
  photoRequestNote?: string;

  // --- 価格・初回注文 ---
  budgetMin: number;
  budgetMax: number;
  /** 初めて行くなら頼むべき一杯（例: "ラーメン＋ライス"） */
  firstVisitOrder: string;
  /** firstVisitOrder の目安価格（円） */
  firstVisitPrice: number;
  /** 学生の一食としての予算感 */
  expectedSpendNote: string;
  priceConfidence: PriceConfidence;

  visualTone: VisualTone;

  // --- 指標（1〜5） ---
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
  /** そのエリアでのアクセスの良さ（最寄駅からの近さ）。高いほど駅近・行きやすい */
  nearness: Level;

  // --- 編集コメント（選ぶ意思決定を助ける） ---
  /** この店を選ぶ理由（カードと詳細で主役にする1〜2文） */
  selectionReason: string;
  /** 逆にこういう日には向かない、という正直な但し書き */
  avoidIf: string;
  keioUseCase: string;
  queueAdvice: string;
  soloAdvice: string;
  beginnerAdvice: string;
  tasteNotes: string;
  atmosphereNotes: string;
  rulesNotes: string;
  recommendedFor: string[];
  accessNote: string;

  // --- リンク ---
  googleMapsUrl: string;
  officialUrl?: string;

  // --- データ信頼性・公開ステータス ---
  /** 最終確認の年月（例: "2026-06"） */
  dataLastChecked: string;
  dataConfidence: DataConfidence;
  /** 価格・営業時間などの変動に関する注意書き */
  dataNote: string;
  publishStatus: PublishStatus;
  editorialPriority: EditorialPriority;
}
