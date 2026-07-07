import Link from "next/link";
import type { ResolvedShelf } from "@/lib/shelves";
import { copy } from "@/content/site-copy";

// 写真に頼らない、番号付きの編集棚。
// 店名・ジャンル・初回の一杯・価格の目安まで、一行で判断できる密度にする。
export default function ShelfList({ shelf }: { shelf: ResolvedShelf }) {
  if (shelf.shops.length === 0) return null;
  const meta = copy.curated.titles[shelf.id];
  // 棚が単一エリアならエリア名は冗長なので省き、複数エリアにまたがる時だけ出す
  const multiArea = new Set(shelf.shops.map((s) => s.area)).size > 1;

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-foreground pb-2">
        <h3 className="text-base font-bold tracking-tight text-foreground">{meta?.ja ?? shelf.title}</h3>
        {meta?.note && <p className="text-xs text-muted">{meta.note}</p>}
      </div>
      <ol className="divide-y divide-border">
        {shelf.shops.map((shop, i) => (
          <li key={shop.id}>
            <Link href={`/shops/${shop.id}`} className="group flex items-center gap-3.5 py-3">
              <span className="w-5 shrink-0 text-right text-xs font-semibold tabular-nums text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                  {shop.name}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted">
                  {[
                    multiArea ? shop.area : null,
                    shop.genres.join("/"),
                    // 初回注文がジャンル名と同一なら重複させない
                    shop.firstVisitOrder !== shop.genres.join("/") ? shop.firstVisitOrder : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
              <span className="shrink-0 text-sm tabular-nums text-foreground">
                ¥{shop.firstVisitPrice.toLocaleString()}
                <span className="ml-0.5 text-[10px] text-muted">前後</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <Link
        href={shelf.href}
        className="mt-2 inline-block text-xs font-medium text-muted transition-colors hover:text-accent"
      >
        {copy.curated.filterCta} →
      </Link>
    </section>
  );
}
