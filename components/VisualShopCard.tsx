import Link from "next/link";
import type { Shop } from "@/lib/types";
import RamenVisual from "./RamenVisual";
import PriceNote from "./PriceNote";
import ScenePills from "./ScenePills";
import MetricBar from "./MetricBar";
import SaveButtons from "./SaveButtons";

export default function VisualShopCard({
  shop,
  header,
  priority = false,
}: {
  shop: Shop;
  /** /results で順位や相性スコアを差し込むためのスロット */
  header?: React.ReactNode;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-foreground/30">
      <Link href={`/shops/${shop.id}`} className="block" aria-label={`${shop.name}の詳細`}>
        <RamenVisual
          tone={shop.visualTone}
          imageUrl={shop.imageUrl}
          imageAlt={shop.imageAlt}
          label={shop.genres[0]}
          priority={priority}
          sizes="(max-width: 640px) 100vw, 360px"
          className="aspect-[16/10] w-full"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {header}

        <Link href={`/shops/${shop.id}`} className="block">
          <h3 className="font-serif text-lg leading-snug text-foreground group-hover:text-accent">
            {shop.name}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {shop.area} ・ {shop.station} ・ {shop.genres.join(" / ")}
          </p>
        </Link>

        <PriceNote
          name={shop.signatureOrderName}
          price={shop.signatureOrderPrice}
          confidence={shop.priceConfidence}
        />

        <p className="line-clamp-2 text-sm leading-relaxed text-foreground/90">{shop.whyThisShop}</p>

        <ScenePills tags={shop.sceneTags} max={3} />

        <div className="flex flex-col gap-1.5">
          <MetricBar compact level={shop.queueLevel} label="並び" />
          <MetricBar compact level={shop.soloFriendly} label="一人" />
          <MetricBar compact level={shop.volume} label="腹パン" />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
          <SaveButtons shopId={shop.id} size="sm" />
          <div className="flex items-center gap-3 text-sm">
            <Link
              href={`/shops/${shop.id}`}
              className="text-foreground underline-offset-4 hover:text-accent hover:underline"
            >
              詳細
            </Link>
            <a
              href={shop.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline-offset-4 hover:text-accent hover:underline"
            >
              Maps
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
