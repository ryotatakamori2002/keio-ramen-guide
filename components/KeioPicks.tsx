import Link from "next/link";
import type { Shop } from "@/lib/types";
import { copy } from "@/content/site-copy";
import PriceNote from "./PriceNote";
import ShopThumb from "./ShopThumb";

// MichelinのEditor's Picks / Eater 38の置き換え。
// 同じカードの反復にせず、横長と縦長を混ぜたポスターの壁として組む。
// 左上の赤い番号ブロックが暖簾の記号。
export default function KeioPicks({ shops }: { shops: Shop[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {shops.map((shop, i) => {
        // 1枚目と4枚目を横長にして、リズムを崩す
        const wide = i % 3 === 0;
        return (
          <article
            key={shop.id}
            className={`relative border border-foreground/60 bg-card ${wide ? "lg:col-span-2" : ""}`}
          >
            <span className="absolute left-0 top-0 z-10 bg-accent px-2.5 py-1 text-xs font-bold tabular-nums text-white">
              {String(i + 1).padStart(2, "0")}
            </span>

            <Link
              href={`/shops/${shop.id}`}
              className={`group flex h-full ${wide ? "flex-col sm:flex-row" : "flex-col"}`}
            >
              <ShopThumb
                genre={shop.genres[0]}
                primaryImageUrl={shop.primaryImageUrl}
                imageAlt={shop.images[0]?.alt}
                size="lg"
                frame={false}
                className={
                  wide
                    ? "h-32 w-full border-b border-border sm:h-auto sm:min-h-full sm:w-44 sm:border-b-0 sm:border-r"
                    : "h-32 w-full border-b border-border"
                }
                sizes={wide ? "176px" : "(max-width: 1024px) 100vw, 300px"}
              />
              <span className="flex min-w-0 flex-1 flex-col p-5">
                <span className="text-[11px] text-muted">
                  {shop.area} · {shop.genres.join("/")}
                </span>
                <span className="mt-1.5 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
                  {shop.name}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-foreground/85">{shop.selectionReason}</span>
                <span className="mt-auto flex flex-wrap items-baseline justify-between gap-2 pt-4">
                  <PriceNote
                    name={shop.firstVisitOrder}
                    price={shop.firstVisitPrice}
                    confidence={shop.priceConfidence}
                  />
                  <span className="text-xs font-medium text-muted transition-colors group-hover:text-accent">
                    {copy.picks.detail} →
                  </span>
                </span>
              </span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
