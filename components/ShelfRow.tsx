import Link from "next/link";
import type { ResolvedShelf } from "@/lib/shelves";
import ShopCard from "./ShopCard";

// 用途別ベスト棚を、横スクロールの編集棚として見せる。
// shelf は関数を含まないシリアライズ可能な形（ResolvedShelf）で受け取る。
export default function ShelfRow({ shelf }: { shelf: ResolvedShelf }) {
  if (shelf.shops.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-foreground">{shelf.title}</h3>
          <p className="mt-0.5 text-xs text-muted">{shelf.subtitle}</p>
        </div>
        <Link href={shelf.href} className="shrink-0 text-xs text-muted hover:text-accent">
          もっと見る →
        </Link>
      </div>
      <div className="-mx-5 mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
        {shelf.shops.map((shop) => (
          <div key={shop.id} className="w-[290px] shrink-0 snap-start">
            <ShopCard shop={shop} />
          </div>
        ))}
      </div>
    </section>
  );
}
