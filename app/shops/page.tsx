import type { Metadata } from "next";
import Link from "next/link";
import { SHOPS, getAllAreas, getAllGenres } from "@/lib/shops";
import { resolveShelves } from "@/lib/shelves";
import { getApprovedPostMeta } from "@/lib/posts";
import { copy } from "@/content/site-copy";
import { type as t } from "@/lib/design";
import FilterableShopList from "@/components/FilterableShopList";
import PhotoCallout from "@/components/PhotoCallout";

export const metadata: Metadata = {
  title: `${copy.shops.title} | ${copy.serviceName}`,
};

function quickFromParams(scene?: string, beginner?: string): string[] {
  const keys: string[] = [];
  if (scene === "solo") keys.push("solo");
  if (scene === "after_drinking") keys.push("drinking");
  if (scene === "hearty") keys.push("hearty");
  if (beginner === "1") keys.push("beginner");
  return keys;
}

// 絞り込みが無い時だけ上部に出す棚。クライアント側のフィルタ状態で表示/非表示を切り替える。
const SHELF_IDS = ["gap-time", "hearty", "no-queue", "mita-lunch", "yokohama-nofail", "first-iekei"];

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; genre?: string; scene?: string; beginner?: string }>;
}) {
  const { area, genre, scene, beginner } = await searchParams;
  const initialArea = area && getAllAreas().includes(area) ? area : null;
  const initialGenre = genre && getAllGenres().includes(genre) ? genre : null;
  const initialQuick = quickFromParams(scene, beginner);

  const shelves = resolveShelves(SHELF_IDS, 5);
  const postMeta = await getApprovedPostMeta();

  return (
    <div className="py-2">
      <p className={t.eyebrow}>{copy.brandLine}</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{copy.shops.title}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        {copy.shops.subtitle}{" "}
        <Link href="/quiz" className="text-accent hover:underline">
          {copy.quiz.title} →
        </Link>
      </p>

      <div className="mt-8">
        <FilterableShopList
          shops={SHOPS}
          initialArea={initialArea}
          initialGenre={initialGenre}
          initialQuick={initialQuick}
          shelves={shelves}
          postMeta={postMeta}
        />
      </div>

      <div className="mt-14">
        <PhotoCallout />
      </div>
    </div>
  );
}
