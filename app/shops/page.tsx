import type { Metadata } from "next";
import { SHOPS, getAllAreas } from "@/lib/shops";
import FilterableShopList from "@/components/FilterableShopList";

export const metadata: Metadata = {
  title: "店舗一覧 | Keio Ramen Guide",
};

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  const validAreas = getAllAreas();
  const initialArea = area && validAreas.includes(area) ? area : null;

  return (
    <div>
      <h1 className="text-lg font-bold text-foreground">店舗一覧</h1>
      <p className="mt-1 text-sm text-muted">日吉・三田・横浜のラーメン店を、シーンや気分で絞り込めます。</p>
      <div className="mt-4">
        <FilterableShopList shops={SHOPS} initialArea={initialArea} />
      </div>
    </div>
  );
}
