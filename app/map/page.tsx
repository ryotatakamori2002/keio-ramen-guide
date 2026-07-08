import type { Metadata } from "next";
import Link from "next/link";
import { getCatalogVisibleShops } from "@/lib/catalog";
import { LIVE_AREAS, getAreaInfo } from "@/lib/areas";
import { copy } from "@/content/site-copy";
import { type as t } from "@/lib/design";
import ComingSoonAreas from "@/components/ComingSoonAreas";
import MapAreaTabs, { type MapShop } from "./MapAreaTabs";

export const metadata: Metadata = {
  title: `${copy.map.title} | ${copy.serviceName}`,
};

export const revalidate = 60;

// 地図ページ。Google Maps APIは使わず、エリア別の掲載店をMapsリンク付きで一覧する。
// 店舗データは lat/lng カラムを持っているので、将来はここを実地図に置き換えられる。
export default async function MapPage() {
  const shops = await getCatalogVisibleShops();

  // 台帳の掲載中エリア＋（DB追加などで台帳にまだ無いエリア）をタブにする
  const areaIds = [
    ...LIVE_AREAS.map((a) => a.id),
    ...Array.from(new Set(shops.map((s) => s.area))).filter((a) => !LIVE_AREAS.some((l) => l.id === a)),
  ];

  const tabs = areaIds
    .map((id) => {
      const info = getAreaInfo(id);
      const areaShops: MapShop[] = shops
        .filter((s) => s.area === id)
        .map((s) => ({
          id: s.id,
          name: s.name,
          station: s.station,
          genres: s.genres,
          photo: s.thumbnailImageUrl ?? s.primaryImageUrl,
          mapsUrl: s.googleMapsUrl,
          order: s.firstVisitOrder,
          price: s.firstVisitPrice,
        }));
      return { id, name: info?.name ?? id, note: info?.note ?? "", shops: areaShops };
    })
    .filter((tab) => tab.shops.length > 0);

  return (
    <div className="py-2">
      <p className={t.eyebrow}>{copy.map.eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{copy.map.title}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">{copy.map.subtitle}</p>

      <div className="mt-7">
        <MapAreaTabs tabs={tabs} />
      </div>

      <div className="mt-12">
        <ComingSoonAreas />
      </div>

      <p className="mt-8 text-xs text-muted">
        <Link href="/shops" className="underline decoration-border underline-offset-4 hover:text-accent">
          {copy.curated.viewAll}
        </Link>
      </p>
    </div>
  );
}
