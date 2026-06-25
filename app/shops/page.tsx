import type { Metadata } from "next";
import { SHOPS, getAllAreas, getAllGenres } from "@/lib/shops";
import FilterableShopList from "@/components/FilterableShopList";

export const metadata: Metadata = {
  title: "今日の一杯を探す | Keio Ramen Guide",
};

// URL の scene / beginner パラメータを、一覧のクイック条件キーに変換する。
function quickFromParams(scene?: string, beginner?: string): string[] {
  const keys: string[] = [];
  if (scene === "solo") keys.push("solo");
  if (scene === "after_drinking") keys.push("drinking");
  if (scene === "hearty") keys.push("hearty");
  if (beginner === "1") keys.push("beginner");
  return keys;
}

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; genre?: string; scene?: string; beginner?: string }>;
}) {
  const { area, genre, scene, beginner } = await searchParams;
  const initialArea = area && getAllAreas().includes(area) ? area : null;
  const initialGenre = genre && getAllGenres().includes(genre) ? genre : null;
  const initialQuick = quickFromParams(scene, beginner);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">今日の一杯を探す</h1>
      <p className="mt-2 text-sm text-muted">
        日吉・三田・横浜。授業後、空きコマ、飲み後に使えるラーメン案内。
      </p>
      <div className="mt-6">
        <FilterableShopList
          shops={SHOPS}
          initialArea={initialArea}
          initialGenre={initialGenre}
          initialQuick={initialQuick}
        />
      </div>
    </div>
  );
}
