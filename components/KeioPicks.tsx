import Link from "next/link";
import type { Shop } from "@/lib/types";
import { copy } from "@/content/site-copy";
import PriceNote from "./PriceNote";

// MichelinのEditor's Picks / Eater 38の置き換え。
// 星や点数ではなく「初回注文・価格・一言」で、数を絞った基準の店を1枠ずつ見せる。
export default function KeioPicks({ shops }: { shops: Shop[] }) {
  return (
    <div className="grid gap-x-14 lg:grid-cols-2">
      {shops.map((shop, i) => (
        <article key={shop.id} className="border-t border-foreground/60 py-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</p>
            <p className="text-[11px] text-muted">
              {shop.area} · {shop.genres.join("/")}
            </p>
          </div>
          <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground">
            <Link href={`/shops/${shop.id}`} className="transition-colors hover:text-accent">
              {shop.name}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{shop.selectionReason}</p>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <PriceNote name={shop.firstVisitOrder} price={shop.firstVisitPrice} confidence={shop.priceConfidence} />
            <Link
              href={`/shops/${shop.id}`}
              className="text-xs font-medium text-muted transition-colors hover:text-accent"
            >
              {copy.picks.detail} →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
