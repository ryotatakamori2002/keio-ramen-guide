import Link from "next/link";
import type { PostMeta, Shop } from "@/lib/types";
import { needsReviewFlag } from "@/lib/shops";
import ShopThumb from "./ShopThumb";
import PriceNote from "./PriceNote";
import ScenePills from "./ScenePills";
import MetricStrip from "./MetricStrip";
import SaveButtons from "./SaveButtons";

// 写真ではなく「今日行く判断材料」を主役にした横長の情報カード。
// 実食投稿があれば、最新写真をサムネに使い件数を出して「人が食べた感」を出す。
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
    <article className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30">
      {header}

      <div className="flex gap-3.5">
        <Link href={`/shops/${shop.id}`} className="shrink-0" tabIndex={-1} aria-hidden>
          <ShopThumb
            genre={shop.genres[0]}
            tone={shop.visualTone}
            primaryImageUrl={thumbImage}
            imageAlt={shop.images[0]?.alt}
            photoStatus={shop.photoStatus}
            photoNeeded={shop.photoNeeded}
            className="h-[84px] w-[84px]"
            sizes="84px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link href={`/shops/${shop.id}`} className="group block">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-bold text-foreground group-hover:text-accent">{shop.name}</h3>
              {needsReviewFlag(shop) && (
                <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">
                  要確認
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-muted">
              {shop.area} ・ {shop.station} ・ {shop.genres.join("/")}
            </p>
          </Link>
          <PriceNote
            className="mt-1.5"
            name={shop.firstVisitOrder}
            price={shop.firstVisitPrice}
            confidence={shop.priceConfidence}
          />
          <p className="mt-1 text-xs text-muted">
            {postCount > 0 ? `実食ログ ${postCount}件` : "実食ログ募集中"}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{shop.selectionReason}</p>

      <div className="mt-2.5">
        <ScenePills tags={shop.sceneTags} max={3} />
      </div>

      <div className="mt-2.5 border-t border-border pt-2.5">
        <MetricStrip shop={shop} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <SaveButtons shopId={shop.id} size="sm" />
        <div className="flex items-center gap-3 text-sm">
          <Link href={`/post?shop=${shop.id}`} className="font-medium text-accent hover:underline">
            投稿
          </Link>
          <Link href={`/shops/${shop.id}`} className="font-medium text-foreground hover:text-accent">
            詳細
          </Link>
          <a
            href={shop.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent"
          >
            Maps
          </a>
        </div>
      </div>
    </article>
  );
}
