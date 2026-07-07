import Link from "next/link";
import type { Shop } from "@/lib/types";
import { copy } from "@/content/site-copy";
import { button } from "@/lib/design";
import ShopThumb from "./ShopThumb";
import PriceNote from "./PriceNote";

// Heroの右側に置く「今日の一杯」。写真の代わりに、店名・一言・初回注文を
// 雑誌の記事枠のように太罫線で組む（Eater Heatmap / Michelin Picksの1枠を1店に絞った形）。
export default function FeaturedBowl({ shop }: { shop: Shop }) {
  return (
    <article className="border-y-2 border-foreground py-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-muted">
          <span aria-hidden className="h-2 w-2 bg-accent" />
          {copy.featured.label}
        </p>
        <p className="text-[11px] tracking-[0.14em] text-muted">{shop.area}</p>
      </div>

      <div className="mt-4 flex gap-4">
        <ShopThumb genre={shop.genres[0]} primaryImageUrl={shop.primaryImageUrl} className="h-24 w-24 shrink-0" />
        <div className="min-w-0">
          <h2 className="text-xl font-bold leading-snug tracking-tight text-foreground">
            <Link href={`/shops/${shop.id}`} className="hover:text-accent">
              {shop.name}
            </Link>
          </h2>
          <p className="mt-1 text-xs text-muted">
            {shop.station} · {shop.genres.join("/")}
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-foreground/90">{shop.selectionReason}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
        <div>
          <p className="text-[11px] text-muted">{copy.shopDetail.firstOrderLabel}</p>
          <PriceNote
            className="mt-0.5"
            name={shop.firstVisitOrder}
            price={shop.firstVisitPrice}
            confidence={shop.priceConfidence}
          />
        </div>
        <Link href={`/shops/${shop.id}`} className={button.small}>
          {copy.featured.cta}
        </Link>
      </div>
    </article>
  );
}
