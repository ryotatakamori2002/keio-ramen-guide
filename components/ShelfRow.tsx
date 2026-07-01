import Link from "next/link";
import type { ResolvedShelf } from "@/lib/shelves";
import { copy } from "@/content/site-copy";
import { type } from "@/lib/design";
import ShopCard from "./ShopCard";

// 用途別ベスト棚。英字の編集名＋和文で「編集された棚」に見せる。
export default function ShelfRow({ shelf }: { shelf: ResolvedShelf }) {
  if (shelf.shops.length === 0) return null;
  const title = copy.shelfTitles[shelf.id];

  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className={type.eyebrow}>{title?.en ?? shelf.title}</p>
          <h3 className="mt-1 text-base font-bold tracking-tight text-foreground">{title?.ja ?? shelf.title}</h3>
        </div>
        <Link href={shelf.href} className="shrink-0 text-xs text-muted hover:text-accent">
          View all →
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
