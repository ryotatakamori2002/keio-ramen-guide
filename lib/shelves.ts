import type { Shop } from "./types";
import { SHOPS } from "./shops";

// 用途別ベスト棚。単なるフィルタではなく「編集されたおすすめ棚」として見せる。
// 各棚は predicate で候補を絞り、keioStudentScore → dataConfidence の順で並べて上位3〜5件を出す。
// href は /shops の対応する絞り込みに飛ばす（棚＝入口、/shops＝全件）。

export interface Shelf {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  match: (shop: Shop) => boolean;
}

const CONFIDENCE_RANK: Record<Shop["dataConfidence"], number> = { high: 2, medium: 1, low: 0 };

// 棚に出してよい店の品質ゲート。ready かつ high/medium かつ must/should、
// さらに選ぶ理由・初回注文・予算メモ・Maps が揃っている店だけ。
function shelfEligible(shop: Shop): boolean {
  return (
    shop.publishStatus === "ready" &&
    shop.dataConfidence !== "low" &&
    shop.editorialPriority !== "could" &&
    Boolean(shop.selectionReason && shop.firstVisitOrder && shop.expectedSpendNote && shop.googleMapsUrl)
  );
}

export const SHELVES: Shelf[] = [
  {
    id: "hiyoshi-after-class",
    title: "日吉で授業後に外さない",
    subtitle: "キャンパスから近くて、腹を満たして帰れる",
    href: "/shops?area=日吉",
    match: (s) => s.area === "日吉" && s.nearness >= 4 && s.volume >= 3,
  },
  {
    id: "gap-time",
    title: "空きコマで行ける",
    subtitle: "提供が早く、駅近でさっと食べられる",
    href: "/shops",
    match: (s) => s.speedLevel >= 4 && s.nearness >= 4 && s.queueLevel <= 3,
  },
  {
    id: "solo",
    title: "一人飯しやすい",
    subtitle: "カウンター中心で、一人でも気兼ねなく",
    href: "/shops?scene=solo",
    match: (s) => s.soloFriendly >= 4,
  },
  {
    id: "hearty",
    title: "腹パンになりたい",
    subtitle: "量で殴ってくる、空腹で行きたい店",
    href: "/shops?scene=hearty",
    match: (s) => s.volume >= 4,
  },
  {
    id: "first-iekei",
    title: "初めての家系",
    subtitle: "濃いけど、初回でも頼み方に迷わない",
    href: "/shops?genre=家系",
    match: (s) => s.genres.includes("家系") && s.beginnerFriendly >= 4,
  },
  {
    id: "jiro",
    title: "二郎系に挑戦",
    subtitle: "元祖からインスパイアまで",
    href: "/shops?genre=二郎系",
    match: (s) => s.genres.includes("二郎系"),
  },
  {
    id: "after-drinking",
    title: "飲み後の一杯",
    subtitle: "遅い時間でも開いている〆ラーメン",
    href: "/shops?scene=after_drinking",
    match: (s) => s.lateNight || s.sceneTags.includes("after_drinking"),
  },
  {
    id: "mita-lunch",
    title: "三田の昼休み",
    subtitle: "キャンパス周辺で、昼にさっと",
    href: "/shops?area=三田",
    match: (s) => s.area === "三田" && s.nearness >= 4,
  },
  {
    id: "yokohama-nofail",
    title: "横浜で外さない",
    subtitle: "遊び・乗り換え・帰り道に",
    href: "/shops?area=横浜",
    match: (s) => s.area === "横浜" && (s.keioStudentScore >= 4 || s.sceneTags.includes("no_fail") || s.nearness >= 5),
  },
  {
    id: "no-queue",
    title: "並びたくない日",
    subtitle: "行列が少なく、回転が早い",
    href: "/shops",
    match: (s) => s.queueLevel <= 2 && s.speedLevel >= 3,
  },
];

export function shopsForShelf(shelf: Shelf, limit = 5): Shop[] {
  return SHOPS.filter((s) => shelfEligible(s) && shelf.match(s))
    .sort(
      (a, b) =>
        b.keioStudentScore - a.keioStudentScore ||
        CONFIDENCE_RANK[b.dataConfidence] - CONFIDENCE_RANK[a.dataConfidence],
    )
    .slice(0, limit);
}

export function getShelf(id: string): Shelf | undefined {
  return SHELVES.find((s) => s.id === id);
}

// クライアントコンポーネントに渡せるよう、関数(match)を含まないシリアライズ可能な形に解決する。
export interface ResolvedShelf {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  shops: Shop[];
}

export function resolveShelf(shelf: Shelf, limit = 5): ResolvedShelf {
  const { id, title, subtitle, href } = shelf;
  return { id, title, subtitle, href, shops: shopsForShelf(shelf, limit) };
}

export function resolveShelves(ids: string[], limit = 5): ResolvedShelf[] {
  return ids
    .map((id) => getShelf(id))
    .filter((s): s is Shelf => Boolean(s))
    .map((s) => resolveShelf(s, limit));
}
