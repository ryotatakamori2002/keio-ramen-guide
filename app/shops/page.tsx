import type { Metadata } from "next";
import { SHOPS, getAllAreas, getAllGenres } from "@/lib/shops";
import { SCENE_OPTIONS } from "@/lib/quiz";
import type { SceneTag } from "@/lib/types";
import FilterableShopList from "@/components/FilterableShopList";

export const metadata: Metadata = {
  title: "店舗を探す | Keio Ramen Guide",
};

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; genre?: string; scene?: string; beginner?: string }>;
}) {
  const { area, genre, scene, beginner } = await searchParams;
  const initialArea = area && getAllAreas().includes(area) ? area : null;
  const initialGenre = genre && getAllGenres().includes(genre) ? genre : null;
  const initialScene = SCENE_OPTIONS.some((s) => s.value === scene) ? (scene as SceneTag) : null;
  const initialBeginnerOnly = beginner === "1";

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground">店舗を探す</h1>
      <p className="mt-2 text-sm text-muted">日吉・三田・横浜。今いる場所と気分で絞り込めます。</p>
      <div className="mt-6">
        <FilterableShopList
          shops={SHOPS}
          initialArea={initialArea}
          initialGenre={initialGenre}
          initialScene={initialScene}
          initialBeginnerOnly={initialBeginnerOnly}
        />
      </div>
    </div>
  );
}
