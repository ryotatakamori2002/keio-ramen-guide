import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopById, SHOPS } from "@/lib/shops";
import { getApprovedPostsByShop } from "@/lib/posts";
import type { DataConfidence, Shop } from "@/lib/types";
import { copy } from "@/content/site-copy";
import { button, type as t } from "@/lib/design";
import ShopThumb from "@/components/ShopThumb";
import PriceNote from "@/components/PriceNote";
import ScenePills from "@/components/ScenePills";
import SaveButtons from "@/components/SaveButtons";
import PostList from "@/components/PostList";

// 承認された実食投稿を反映するため ISR（最大60秒で更新）
export const revalidate = 60;

export function generateStaticParams() {
  return SHOPS.map((shop) => ({ id: shop.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const shop = getShopById(id);
  if (!shop) return { title: "Not found" };
  return {
    title: `${shop.name} | ${copy.serviceName}`,
    description: shop.selectionReason,
  };
}

const METRICS: { label: string; key: keyof Pick<Shop, "nearness" | "queueLevel" | "soloFriendly" | "volume" | "beginnerFriendly"> }[] = [
  { label: "近さ", key: "nearness" },
  { label: "並び", key: "queueLevel" },
  { label: "一人", key: "soloFriendly" },
  { label: "量", key: "volume" },
  { label: "初心者", key: "beginnerFriendly" },
];

const CONFIDENCE_LABEL: Record<DataConfidence, string> = { high: "High", medium: "Medium", low: "Low" };

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = getShopById(id);
  if (!shop) notFound();

  const posts = await getApprovedPostsByShop(id);
  const needsReview = shop.dataConfidence === "low" || shop.publishStatus === "needs_review";

  return (
    <div className="mx-auto max-w-2xl py-2">
      <Link href="/shops" className="text-xs text-muted hover:text-accent">
        {copy.detail.back}
      </Link>

      {/* 1. Shop Header */}
      <div className="mt-5 flex gap-4">
        <ShopThumb
          genre={shop.genres[0]}
          primaryImageUrl={shop.primaryImageUrl}
          imageAlt={shop.images[0]?.alt}
          className="h-28 w-28 shrink-0 sm:h-32 sm:w-32"
          sizes="128px"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{shop.name}</h1>
            {needsReview && (
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
                {copy.shop.review}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            {shop.area} · {shop.station} · {shop.genres.join("/")}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted">{copy.shop.firstVisitLabel}</p>
          <PriceNote
            className="mt-0.5"
            name={shop.firstVisitOrder}
            price={shop.firstVisitPrice}
            confidence={shop.priceConfidence}
          />
          <p className="mt-1 text-xs text-muted">{shop.expectedSpendNote}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <SaveButtons shopId={shop.id} size="md" />
        <a href={shop.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={button.small}>
          {copy.shop.maps}
        </a>
        <Link href={`/post?shop=${shop.id}`} className={button.small}>
          {copy.detail.logsEmptyCta}
        </Link>
      </div>

      {needsReview && (
        <p className="mt-4 rounded-lg border border-border bg-accent-soft px-3.5 py-2.5 text-xs leading-relaxed text-accent-dark">
          {copy.detail.reviewBanner}
        </p>
      )}

      {/* 2. Logs */}
      <section className="mt-10">
        <SectionHead label={copy.detail.logsTitle.label} title={copy.detail.logsTitle.title} count={posts.length} />
        <div className="mt-4">
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
              <p className={t.eyebrow}>{copy.empty.noPhoto}</p>
              <p className="mt-3 text-sm text-muted">{copy.detail.logsEmpty}</p>
              <Link href={`/post?shop=${shop.id}`} className={`${button.link} mt-3 inline-block`}>
                {copy.detail.logsEmptyCta} →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. Decision Notes */}
      <section className="mt-10">
        <SectionHead label={copy.detail.notesTitle.label} title={copy.detail.notesTitle.title} />
        <p className="mt-4 text-base leading-relaxed text-foreground">{shop.selectionReason}</p>

        <dl className="mt-5 divide-y divide-border border-y border-border">
          <Row term={copy.detail.avoid}>{shop.avoidIf}</Row>
          <Row term={copy.detail.queue}>{shop.queueAdvice}</Row>
          <Row term={copy.detail.solo}>{shop.soloAdvice}</Row>
          <Row term={copy.detail.beginner}>{shop.beginnerAdvice}</Row>
          <Row term={copy.detail.taste}>
            {shop.tasteNotes}
            {shop.atmosphereNotes ? ` ${shop.atmosphereNotes}` : ""}
          </Row>
          <Row term={copy.detail.rules}>{shop.rulesNotes}</Row>
        </dl>

        <div className="mt-5 grid grid-cols-5 gap-2 rounded-xl border border-border bg-card p-3 text-center">
          {METRICS.map((m) => (
            <div key={m.key}>
              <div className="text-lg font-bold text-foreground">{shop[m.key]}</div>
              <div className="mt-0.5 text-[11px] text-muted">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Keio Use Case */}
      <section className="mt-10">
        <SectionHead label={copy.detail.useCaseTitle.label} title={copy.detail.useCaseTitle.title} />
        <p className="mt-4 text-sm leading-relaxed text-foreground/85">{shop.keioUseCase}</p>
        <p className="mt-1.5 text-xs text-muted">{shop.accessNote}</p>
        <div className="mt-3">
          <ScenePills tags={shop.sceneTags} max={shop.sceneTags.length} />
        </div>
        <ul className="mt-3 flex flex-col gap-1 text-sm text-foreground/80">
          {shop.recommendedFor.map((item) => (
            <li key={item}>— {item}</li>
          ))}
        </ul>
      </section>

      {/* 5. Data Note */}
      <section className="mt-10 rounded-xl border border-border bg-card p-4 text-xs text-muted">
        <p className={t.eyebrow}>{copy.detail.dataTitle.label}</p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          <span>{copy.detail.lastChecked}: {shop.dataLastChecked}</span>
          <span>{copy.detail.confidence}: {CONFIDENCE_LABEL[shop.dataConfidence]}</span>
        </div>
        <p className="mt-2 leading-relaxed">{copy.detail.dataNote}</p>
      </section>

      <div className="mt-6">
        <SaveButtons shopId={shop.id} size="md" />
      </div>
    </div>
  );
}

function SectionHead({ label, title, count }: { label: string; title: string; count?: number }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className={t.eyebrow}>{label}</p>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-foreground">
          {title}
          {typeof count === "number" && count > 0 && <span className="ml-2 text-sm font-normal text-muted">{count}</span>}
        </h2>
      </div>
    </div>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[64px_1fr] gap-3 py-3 text-sm">
      <dt className="text-xs text-muted">{term}</dt>
      <dd className="leading-relaxed text-foreground/85">{children}</dd>
    </div>
  );
}
