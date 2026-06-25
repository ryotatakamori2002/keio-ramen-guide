import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopById, SHOPS } from "@/lib/shops";
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
  return { title: shop ? `${shop.name} | Keio Ramen Guide` : "店舗が見つかりません" };
}

const METRICS: { label: string; key: "nearness" | "queueLevel" | "soloFriendly" | "volume" | "beginnerFriendly" }[] = [
  { label: "近さ", key: "nearness" },
  { label: "並び", key: "queueLevel" },
  { label: "一人", key: "soloFriendly" },
  { label: "量", key: "volume" },
  { label: "初心者", key: "beginnerFriendly" },
];

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
          imageUrl={shop.imageUrl}
          imageAlt={shop.imageAlt}
          className="h-24 w-24 shrink-0 sm:h-28 sm:w-28"
          sizes="112px"
        />
        <div className="min-w-0">
          <h1 className="text-xl font-bold leading-tight text-foreground sm:text-2xl">{shop.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {shop.area} ・ {shop.station} ・ {shop.genres.join("/")}
          </p>
          <PriceNote
            className="mt-2"
            name={shop.signatureOrderName}
            price={shop.signatureOrderPrice}
            confidence={shop.priceConfidence}
          />
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
        <p className="text-base leading-relaxed text-foreground">{shop.whyThisShop}</p>
      </Section>

      <Section title="おすすめ注文">
        <p>{shop.recommendedMenu}</p>
        <p className="mt-1 text-sm text-muted">学生の一食目安：¥{shop.budgetMin.toLocaleString()}〜{shop.budgetMax.toLocaleString()}（{shop.studentBudgetNote}）</p>
      </Section>

      <Section title="慶應生向けコメント">
        <p>{shop.keioNotes}</p>
        <p className="mt-1.5 text-sm text-muted">{shop.accessNote}</p>
      </Section>

      <Section title="味の特徴・雰囲気">
        <p>{shop.tasteNotes}</p>
        <p className="mt-2">{shop.atmosphereNotes}</p>
      </Section>

      <Section title="初心者向け情報">
        <p>{shop.beginnerNotes}</p>
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

      <p className="mt-8 border-t border-border pt-4 text-xs text-muted">
        価格・営業時間・サービス内容は変動する可能性があります。訪問前に各店の最新情報をご確認ください。
      </p>

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
