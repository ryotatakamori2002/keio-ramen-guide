import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopById, SHOPS } from "@/lib/shops";
import type { DataConfidence, Shop } from "@/lib/types";
import ShopThumb from "@/components/ShopThumb";
import PriceNote from "@/components/PriceNote";
import ScenePills from "@/components/ScenePills";
import SaveButtons from "@/components/SaveButtons";

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
  if (!shop) return { title: "店舗が見つかりません" };
  return {
    title: `${shop.name} | Keio Ramen Guide`,
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

const CONFIDENCE_LABEL: Record<DataConfidence, string> = {
  high: "高",
  medium: "中",
  low: "低（要確認）",
};

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = getShopById(id);
  if (!shop) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/shops" className="text-xs text-muted hover:text-accent">
        ← 店舗を探す
      </Link>

      {/* 上部: 識別ビジュアル + 基本情報 + 価格 + アクション */}
      <div className="mt-4 flex gap-4">
        <ShopThumb
          genre={shop.genres[0]}
          tone={shop.visualTone}
          primaryImageUrl={shop.primaryImageUrl}
          imageAlt={shop.images[0]?.alt}
          photoStatus={shop.photoStatus}
          photoNeeded={shop.photoNeeded}
          className="h-28 w-28 shrink-0 sm:h-32 sm:w-32"
          sizes="128px"
        />
        <div className="min-w-0">
          <h1 className="text-xl font-bold leading-tight text-foreground sm:text-2xl">{shop.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {shop.area} ・ {shop.station} ・ {shop.genres.join("/")}
          </p>
          <PriceNote
            className="mt-2"
            name={shop.firstVisitOrder}
            price={shop.firstVisitPrice}
            confidence={shop.priceConfidence}
          />
          <p className="mt-1 text-xs text-muted">{shop.expectedSpendNote}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <SaveButtons shopId={shop.id} size="md" />
        <a
          href={shop.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Google Maps
        </a>
      </div>

      {/* 指標カード */}
      <div className="mt-6 grid grid-cols-5 gap-2 rounded-lg border border-border bg-card p-3 text-center">
        {METRICS.map((m) => (
          <div key={m.key}>
            <div className="text-lg font-bold text-foreground">{shop[m.key]}</div>
            <div className="mt-0.5 text-[11px] text-muted">{m.label}</div>
          </div>
        ))}
      </div>

      <Section title="この店を選ぶ理由">
        <p className="text-base leading-relaxed text-foreground">{shop.selectionReason}</p>
      </Section>

      <Section title="逆に、こんな日は避ける">
        <p>{shop.avoidIf}</p>
      </Section>

      <Section title="初回のおすすめ注文">
        <p className="font-medium text-foreground">{shop.firstVisitOrder}</p>
        <p className="mt-1 text-sm text-muted">学生の一食目安：{shop.expectedSpendNote}</p>
      </Section>

      <Section title="慶應生向けの使い方">
        <p>{shop.keioUseCase}</p>
        <p className="mt-1.5 text-sm text-muted">{shop.accessNote}</p>
      </Section>

      <Section title="味の特徴・雰囲気">
        <p>{shop.tasteNotes}</p>
        <p className="mt-2">{shop.atmosphereNotes}</p>
      </Section>

      <Section title="並び・一人・初心者のアドバイス">
        <ul className="flex flex-col gap-1.5">
          <li>
            <span className="text-muted">並び：</span>
            {shop.queueAdvice}
          </li>
          <li>
            <span className="text-muted">一人：</span>
            {shop.soloAdvice}
          </li>
          <li>
            <span className="text-muted">初心者：</span>
            {shop.beginnerAdvice}
          </li>
        </ul>
      </Section>

      <Section title="注文ルール・暗黙知">
        <p>{shop.rulesNotes}</p>
      </Section>

      <Section title="どんな日に向いているか">
        <ScenePills tags={shop.sceneTags} max={shop.sceneTags.length} />
        <ul className="mt-3 flex flex-col gap-1">
          {shop.recommendedFor.map((item) => (
            <li key={item}>・{item}</li>
          ))}
        </ul>
      </Section>

      {/* データ信頼性 */}
      <div className="mt-8 rounded-lg border border-border bg-card p-4 text-xs text-muted">
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <span>最終確認：{shop.dataLastChecked}</span>
          <span>情報の信頼度：{CONFIDENCE_LABEL[shop.dataConfidence]}</span>
          {shop.photoNeeded && <span>写真：募集中</span>}
        </div>
        <p className="mt-2">{shop.dataNote}</p>
      </div>

      <div className="mt-5">
        <SaveButtons shopId={shop.id} size="md" />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-muted">{title}</h2>
      <div className="text-[15px] leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}
