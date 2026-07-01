import Link from "next/link";
import type { PostMeta, Shop } from "@/lib/types";
import { needsReviewFlag } from "@/lib/shops";
import { copy } from "@/content/site-copy";
import { card, tag } from "@/lib/design";
import ShopThumb from "./ShopThumb";
import PriceNote from "./PriceNote";
import ScenePills from "./ScenePills";
import MetricStrip from "./MetricStrip";
import SaveButtons from "./SaveButtons";

// 「次の一杯を決める判断材料」を主役にした店舗カード。
export default function ShopCard({
  shop,
  header,
  postMeta,
}: {
  shop: Shop;
  header?: React.ReactNode;
  postMeta?: PostMeta;
}) {
  const thumbImage = postMeta?.latestImageUrl ?? shop.primaryImageUrl;
  const postCount = postMeta?.count ?? 0;

  return (
    <article className={`${card.base} ${card.hover} p-4`}>
      {header}

      <div className="flex gap-3.5">
        <Link href={`/shops/${shop.id}`} className="shrink-0" tabIndex={-1} aria-hidden>
          <ShopThumb
            genre={shop.genres[0]}
            primaryImageUrl={thumbImage}
            imageAlt={shop.images[0]?.alt}
            className="h-[84px] w-[84px]"
            sizes="84px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link href={`/shops/${shop.id}`} className="group block">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-bold tracking-tight text-foreground group-hover:text-accent">
                {shop.name}
              </h3>
              {needsReviewFlag(shop) && <span className={`${tag.status} shrink-0`}>{copy.shop.review}</span>}
            </div>
            <p className="mt-0.5 truncate text-xs text-muted">
              {shop.area} · {shop.station} · {shop.genres.join("/")}
            </p>
          </Link>
          <PriceNote
            className="mt-1.5"
            name={shop.firstVisitOrder}
            price={shop.firstVisitPrice}
            confidence={shop.priceConfidence}
          />
          <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">
            {postCount > 0 ? `${copy.shop.logsLabel} · ${postCount}` : copy.shop.logsNone}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/85">{shop.selectionReason}</p>

      <div className="mt-2.5">
        <ScenePills tags={shop.sceneTags} max={3} />
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <MetricStrip shop={shop} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <SaveButtons shopId={shop.id} size="sm" />
        <div className="flex items-center gap-3 text-sm">
          <Link href={`/post?shop=${shop.id}`} className="font-medium text-accent hover:underline">
            {copy.shop.addLog}
          </Link>
          <Link href={`/shops/${shop.id}`} className="font-medium text-foreground hover:text-accent">
            {copy.shop.detail}
          </Link>
          <a
            href={shop.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent"
          >
            {copy.shop.maps}
          </a>
        </div>
      </div>
    </article>
  );
}
