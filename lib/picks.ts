import type { Shop } from "./types";
import { SHOPS, getShopById } from "./shops";

// Keio Picks（トップの推薦棚）の選定ロジック。
//
// 方針:
// - 投稿が集まるまでは編集部の手動順位（MANUAL_PICK_IDS）を使う
// - 承認済み投稿が付き始めたら、投稿数の多い順が自然に上位になる
// - 将来は「行きたい/行った」の集計（DB化後）も同じ関数に足す
//
// ラーメン二郎 三田本店は慶應生にとって象徴的な店なので、手動順位では先頭に置く。
const MANUAL_PICK_IDS = ["mita-jiro", "yokohama-ishinshoten", "hiyoshi-musashiya", "yokohama-afuri"];

// Picksに出してよい店の条件。要確認・調査中・信頼度低は出さない。
function pickEligible(shop: Shop): boolean {
  return shop.publishStatus === "ready" && shop.dataConfidence !== "low";
}

export interface KeioPicksOptions {
  /** shopId -> 承認済み投稿数（getApprovedPostMeta 由来）。未設定・空なら手動順位を使う */
  postCounts?: Record<string, number>;
  limit?: number;
}

export function getKeioPicks({ postCounts = {}, limit = 4 }: KeioPicksOptions = {}): Shop[] {
  const hasCounts = Object.values(postCounts).some((n) => n > 0);

  if (!hasCounts) {
    // 手動順位（投稿ゼロの間の基準）
    return MANUAL_PICK_IDS.map((id) => getShopById(id))
      .filter((s): s is Shop => Boolean(s))
      .filter(pickEligible)
      .slice(0, limit);
  }

  // 投稿が付いたら: 投稿数 desc → must優先 → 手動順位 → 慶應生スコア
  const manualRank = new Map(MANUAL_PICK_IDS.map((id, i) => [id, i]));
  return SHOPS.filter(pickEligible)
    .sort(
      (a, b) =>
        (postCounts[b.id] ?? 0) - (postCounts[a.id] ?? 0) ||
        Number(a.editorialPriority !== "must") - Number(b.editorialPriority !== "must") ||
        (manualRank.get(a.id) ?? 99) - (manualRank.get(b.id) ?? 99) ||
        b.keioStudentScore - a.keioStudentScore,
    )
    .slice(0, limit);
}
