import Image from "next/image";
import Link from "next/link";
import { getShopById } from "@/lib/shops";
import { copy } from "@/content/site-copy";
import PriceNote from "./PriceNote";

// エリアを「駅」ではなく「慶應生の生活圏」として見せる特集リード3本。
// 交通案内図はやめ、写真（左右交互）＋時間の文脈＋代表店＋導線で1エリア1段の誌面にする。
// 路線情報はメタデータとして1行に格下げする。
export default function CampusGuide({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="border-b border-border">
      {copy.campus.areas.map((area, i) => {
        const rep = getShopById(area.rep);
        const photo = rep?.thumbnailImageUrl ?? rep?.heroImageUrl;
        const reverse = i % 2 === 1;
        return (
          <article key={area.id} className="border-t border-border py-6 first:border-t-2 first:border-t-foreground sm:py-8">
            <div className={`grid items-center gap-5 sm:gap-8 lg:grid-cols-12`}>
              {/* 写真（左右交互）。エリアの顔は代表店の一杯 */}
              {photo && (
                <Link
                  href={`/shops/${area.rep}`}
                  className={`group relative block overflow-hidden lg:col-span-5 ${reverse ? "lg:order-2" : ""}`}
                  aria-label={rep?.name}
                >
                  <div className="relative aspect-[16/9] w-full sm:aspect-[16/8]">
                    <Image
                      src={photo}
                      alt={rep?.imageAlt ?? rep?.name ?? area.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                </Link>
              )}

              <div className={`lg:col-span-7 ${reverse ? "lg:order-1" : ""}`}>
                <div className="flex items-baseline justify-between gap-4">
                  <Link href={`/shops?area=${encodeURIComponent(area.id)}`} className="group/name min-w-0">
                    <span className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover/name:text-accent sm:text-3xl">
                        {area.name}
                      </span>
                      <span className="text-[10px] tracking-[0.18em] text-muted">{area.en}</span>
                    </span>
                  </Link>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                    {copy.campus.count(counts[area.id] ?? 0)}
                  </span>
                </div>

                <p className="mt-2 max-w-xl text-pretty text-[15px] leading-relaxed text-foreground/90">
                  {area.context}
                </p>
                <p className="mt-1 text-[11px] text-muted">{area.meta}</p>

                {rep && (
                  <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-border pt-3 text-sm">
                    <span className="text-[11px] font-semibold tracking-[0.12em] text-muted">
                      {copy.campus.repLabel}
                    </span>
                    <Link href={`/shops/${rep.id}`} className="font-semibold text-foreground hover:text-accent">
                      {rep.name}
                    </Link>
                    <PriceNote
                      name={rep.firstVisitOrder}
                      price={rep.firstVisitPrice}
                      confidence={rep.priceConfidence}
                      className="text-xs"
                    />
                  </div>
                )}

                <Link
                  href={`/shops?area=${encodeURIComponent(area.id)}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
                >
                  {copy.campus.viewArea}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
