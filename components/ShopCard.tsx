import Link from "next/link";
import type { PostMeta, Shop } from "@/lib/types";
import { needsReviewFlag } from "@/lib/shops";
import { copy } from "@/content/site-copy";
import { tag } from "@/lib/design";
import ShopThumb from "./ShopThumb";
import PriceNote from "./PriceNote";
import ScenePills from "./ScenePills";
import MetricStrip from "./MetricStrip";
import SaveButtons from "./SaveButtons";

// 「次の一杯を決める判断材料」を主役にした店舗の1枠。
// 白カードの箱ではなく、罫線で区切る紙面のリスト行として組む。
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
  // 編集部の基準店（Keio Picks対象）は名前の前に小さな赤印を置く
  const isPick = shop.editorialPriority === "must";

  return (
    <article className="border-t border-border pt-4 pb-5">
      {header}

      <div className="flex gap-3.5">
        {/* 実写真がある店は横長サムネで一覧の中でも目に入るようにする */}
        <Link href={`/shops/${shop.id}`} className="group shrink-0" tabIndex={-1} aria-hidden>
          <ShopThumb
            genre={shop.genres[0]}
            primaryImageUrl={thumbImage}
            imageAlt={shop.imageAlt ?? shop.images[0]?.alt}
            className={thumbImage ? "h-[88px] w-[124px]" : "h-[88px] w-[88px]"}
            sizes="124px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link href={`/shops/${shop.id}`} className="group block">
            <div className="flex items-center gap-2">
              {isPick && (
                <span aria-hidden className="h-2 w-2 shrink-0 bg-accent" title={copy.picks.title} />
              )}
              <h3 className="truncate font-bold tracking-tight text-foreground group-hover:text-accent">
                {shop.name}
              </h3>
              {needsReviewFlag(shop) && <span className={`${tag.status} shrink-0`}>{copy.shopCard.review}</span>}
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
          {postCount > 0 && <p className="mt-1 text-[11px] text-muted">{copy.shopCard.logsCount(postCount)}</p>}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/85">{shop.selectionReason}</p>

      <div className="mt-2.5">
        <ScenePills tags={shop.sceneTags} max={3} />
      </div>

      <div className="mt-3 border-t border-border/70 pt-3">
        <MetricStrip shop={shop} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <SaveButtons shopId={shop.id} size="sm" />
        <div className="flex items-center gap-3 text-sm">
          <Link href={`/post?shop=${shop.id}`} className="text-muted transition-colors hover:text-accent">
            {copy.shopCard.log}
          </Link>
          <Link href={`/shops/${shop.id}`} className="font-medium text-foreground hover:text-accent">
            {copy.shopCard.detail}
          </Link>
          <a
            href={shop.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent"
          >
            {copy.shopCard.maps}
          </a>
        </div>
      </div>
    </article>
  );
}
