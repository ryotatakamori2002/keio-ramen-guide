import Link from "next/link";
import type { Shop } from "@/lib/types";
import { copy } from "@/content/site-copy";
import { button } from "@/lib/design";
import PriceNote from "./PriceNote";

// 「今日の一杯」の全幅帯。醤油ブラウンの背景に、縦書きのジャンル大タイポで
// ポスターのように組む。星も点数もなく、一言と初回注文で決めさせる。
export default function TodaysBowl({ shop }: { shop: Shop }) {
  return (
    <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[auto_1fr]">
      <p
        aria-hidden
        className="hidden select-none text-6xl font-bold leading-none tracking-[0.16em] text-ginger/90 [writing-mode:vertical-rl] lg:block"
      >
        {shop.genres[0]}
      </p>

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-muted">
            <span aria-hidden className="h-2 w-2 bg-accent" />
            {copy.featured.label}
          </p>
          <p className="text-[11px] tracking-[0.14em] text-muted">
            {shop.area} · {shop.station}
          </p>
        </div>

        <h2 className="mt-3 break-keep text-2xl font-bold tracking-tight sm:text-3xl">
          <Link href={`/shops/${shop.id}`} className="transition-colors hover:text-accent">
            {shop.name}
          </Link>
        </h2>
        {/* モバイルではジャンルを横書きで小さく */}
        <p className="mt-1 text-sm text-ginger lg:hidden">{shop.genres.join("/")}</p>

        {/* Heroの一言（selectionReason）と重ならないよう、ここでは使いどころを見せる */}
        <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-foreground/90">{shop.keioUseCase}</p>

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-[11px] text-muted">{copy.shopDetail.firstOrderLabel}</p>
          <PriceNote
            className="mt-0.5"
            name={shop.firstVisitOrder}
            price={shop.firstVisitPrice}
            confidence={shop.priceConfidence}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={`/shops/${shop.id}`} className={button.primary}>
            {copy.featured.cta}
          </Link>
          <Link href={`/post?shop=${shop.id}`} className={button.secondary}>
            {copy.featured.postCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
