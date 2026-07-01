import Link from "next/link";
import type { ResolvedShelf } from "@/lib/shelves";
import { copy } from "@/content/site-copy";
import ShopCard from "./ShopCard";

// 用途別ベスト棚。棚ごとに短い編集意図（note）を添える。ただの横スクロール羅列にしない。
export default function ShelfRow({ shelf }: { shelf: ResolvedShelf }) {
  if (shelf.shops.length === 0) return null;
  const meta = copy.curated.titles[shelf.id];

  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-bold tracking-tight text-foreground">{meta?.ja ?? shelf.title}</h3>
          {meta?.note && <p className="mt-0.5 text-sm text-muted">{meta.note}</p>}
        </div>
        <Link href={shelf.href} className="shrink-0 text-xs font-medium text-muted hover:text-accent">
          もっと見る →
        </Link>
      </div>
      <div className="-mx-5 mt-4 flex snap-x gap-4 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
        {shelf.shops.map((shop) => (
          <div key={shop.id} className="w-[290px] shrink-0 snap-start">
            <ShopCard shop={shop} />
          </div>
        ))}
      </div>
    </section>
  );
}
