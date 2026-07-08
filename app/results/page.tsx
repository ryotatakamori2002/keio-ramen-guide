import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SHOPS } from "@/lib/shops";
import { recommend } from "@/lib/recommend";
import {
  DEFAULT_QUIZ_ANSWERS,
  LOCATION_OPTIONS,
  QUEUE_OPTIONS,
  RICHNESS_OPTIONS,
  SCENE_OPTIONS,
  TASTE_OPTIONS,
  type QuizAnswers,
} from "@/lib/quiz";
import { copy } from "@/content/site-copy";
import { button, type as t } from "@/lib/design";
import ShopThumb from "@/components/ShopThumb";
import PriceNote from "@/components/PriceNote";
import SaveButtons from "@/components/SaveButtons";
import FadeIn from "@/components/motion/FadeIn";
import Stagger from "@/components/motion/Stagger";

export const metadata: Metadata = {
  title: `${copy.results.title} | ${copy.serviceName}`,
};

function pickValid<T extends string>(value: string | undefined, options: { value: T }[], fallback: T): T {
  const found = options.find((option) => option.value === value);
  return found ? found.value : fallback;
}

function parseAnswers(sp: Record<string, string | string[] | undefined>): QuizAnswers {
  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };
  return {
    location: pickValid(get("location"), LOCATION_OPTIONS, DEFAULT_QUIZ_ANSWERS.location),
    scene: pickValid(get("scene"), SCENE_OPTIONS, DEFAULT_QUIZ_ANSWERS.scene),
    taste: pickValid(get("taste"), TASTE_OPTIONS, DEFAULT_QUIZ_ANSWERS.taste),
    richness: pickValid(get("richness"), RICHNESS_OPTIONS, DEFAULT_QUIZ_ANSWERS.richness),
    queue: pickValid(get("queue"), QUEUE_OPTIONS, DEFAULT_QUIZ_ANSWERS.queue),
  };
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const answers = parseAnswers(sp);
  const results = recommend(SHOPS, answers, 5);
  const [top, ...rest] = results;

  return (
    <div className="py-2">
      <p className={t.eyebrow}>{copy.results.eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{copy.results.title}</h1>
      <p className="mt-2 text-sm text-muted">{copy.results.subtitle}</p>

      {/* 1位 — スコア表ではなく「きょうの推薦」として1店を大きく */}
      {top && (
        <FadeIn className="mt-8">
          <article className="border-y-2 border-foreground py-6 sm:py-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-muted">
                <span aria-hidden className="h-2 w-2 bg-accent" />
                {copy.results.topLabel}
              </p>
              <p className="text-[11px] tabular-nums text-muted">
                {copy.results.matchLabel} {top.score}
              </p>
            </div>

            <div className="mt-5 grid items-center gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
              <Link
                href={`/shops/${top.shop.id}`}
                className="group relative block overflow-hidden"
                aria-label={top.shop.name}
              >
                {top.shop.heroImageUrl ? (
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={top.shop.heroImageUrl}
                      alt={top.shop.imageAlt ?? top.shop.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <ShopThumb
                    genre={top.shop.genres[0]}
                    size="lg"
                    className="aspect-[16/10] w-full"
                  />
                )}
              </Link>

              <div className="min-w-0">
                <h2 className="break-keep text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  <Link href={`/shops/${top.shop.id}`} className="transition-colors hover:text-accent">
                    {top.shop.name}
                  </Link>
                </h2>
                <p className="mt-1.5 text-xs text-muted">
                  {top.shop.area} · {top.shop.station} · {top.shop.genres.join("/")}
                </p>

                {top.reasons.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-1 text-sm leading-relaxed text-foreground/85">
                    {top.reasons.map((reason) => (
                      <li key={reason}>— {reason}</li>
                    ))}
                  </ul>
                )}

                <PriceNote
                  className="mt-4"
                  name={top.shop.firstVisitOrder}
                  price={top.shop.firstVisitPrice}
                  confidence={top.shop.priceConfidence}
                />

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link href={`/shops/${top.shop.id}`} className={button.primary}>
                    {copy.results.view}
                  </Link>
                  <SaveButtons shopId={top.shop.id} size="md" />
                </div>
              </div>
            </div>
          </article>
        </FadeIn>
      )}

      {/* 2位以下 — 罫線リスト。スコアは右端に小さく */}
      {rest.length > 0 && (
        <div className="mt-10">
          <FadeIn>
            <h2 className="text-sm font-semibold tracking-[0.08em] text-muted">{copy.results.othersLabel}</h2>
          </FadeIn>
          <Stagger className="mt-3 flex flex-col border-y border-border" gap={0.06}>
            {rest.map((result, i) => (
              <Link
                key={result.shop.id}
                href={`/shops/${result.shop.id}`}
                className="group flex items-center gap-4 border-t border-border py-3.5 first:border-t-0"
              >
                <span className="w-6 shrink-0 text-right text-xs font-semibold tabular-nums text-muted">
                  {String(i + 2).padStart(2, "0")}
                </span>
                <ShopThumb
                  genre={result.shop.genres[0]}
                  primaryImageUrl={result.shop.thumbnailImageUrl ?? result.shop.primaryImageUrl}
                  imageAlt={result.shop.imageAlt}
                  className="h-16 w-20 shrink-0"
                  sizes="80px"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                      {result.shop.name}
                    </span>
                    <span className="hidden shrink-0 text-[11px] text-muted sm:inline">
                      {result.shop.area} · {result.shop.genres[0]}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">
                    {result.reasons[0] ?? result.shop.selectionReason}
                  </span>
                </span>
                <span className="shrink-0 text-[11px] tabular-nums text-muted">
                  {copy.results.matchLabel} {result.score}
                </span>
              </Link>
            ))}
          </Stagger>
        </div>
      )}

      <div className="mt-9 flex flex-wrap items-center gap-4">
        <Link href="/quiz" className={button.secondary}>
          {copy.results.again}
        </Link>
        <Link
          href="/shops"
          className="text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-accent"
        >
          {copy.results.allShops} →
        </Link>
      </div>
    </div>
  );
}
