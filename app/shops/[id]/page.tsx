import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopById, SHOPS } from "@/lib/shops";
import ShopHero from "@/components/ShopHero";
import MetricBar from "@/components/MetricBar";
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

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = getShopById(id);
  if (!shop) notFound();

  return (
    <div className="flex flex-col gap-9 pb-10">
      <div className="flex flex-col gap-4">
        <Link href="/shops" className="text-xs text-muted hover:text-accent">
          ← 店舗を探す
        </Link>
        <ShopHero shop={shop} />
        <div>
          <h1 className="font-serif text-2xl text-foreground sm:text-3xl">{shop.name}</h1>
          <p className="mt-2 text-sm text-muted">
            {shop.area} ・ {shop.station} ・ {shop.genres.join(" / ")}
          </p>
          <p className="mt-1 text-xs text-muted">{shop.accessNote}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-border py-4">
          <SaveButtons shopId={shop.id} />
          <a
            href={shop.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent underline underline-offset-4"
          >
            Google Mapsで見る
          </a>
        </div>
      </div>

      <Section title="おすすめ注文">
        <PriceNote
          name={shop.signatureOrderName}
          price={shop.signatureOrderPrice}
          confidence={shop.priceConfidence}
        />
        <p className="mt-1 text-sm text-muted">{shop.studentBudgetNote}</p>
        <p className="mt-2">{shop.recommendedMenu}</p>
      </Section>

      <Section title="この店を選ぶ理由">
        <p className="font-serif text-lg leading-relaxed text-foreground">{shop.whyThisShop}</p>
      </Section>

      <Section title="慶應生向けコメント">
        <p>{shop.keioNotes}</p>
      </Section>

      <Section title="味・量・並び・入りやすさ">
        <p>{shop.tasteNotes}</p>
        <p className="mt-2">{shop.atmosphereNotes}</p>
        <div className="mt-4 flex flex-col gap-2.5">
          <MetricBar level={shop.richness} label="こってり度" />
          <MetricBar level={shop.volume} label="量" />
          <MetricBar level={shop.queueLevel} label="並び" />
          <MetricBar level={shop.soloFriendly} label="一人で入れる" />
          <MetricBar level={shop.friendFriendly} label="友達向け" />
        </div>
      </Section>

      <Section title="初心者向け情報">
        <p>{shop.beginnerNotes}</p>
      </Section>

      <Section title="注文ルール・暗黙知">
        <p>{shop.rulesNotes}</p>
      </Section>

      <Section title="どんな時に向いているか">
        <ScenePills tags={shop.sceneTags} max={shop.sceneTags.length} />
        <ul className="mt-3 flex flex-col gap-1">
          {shop.recommendedFor.map((item) => (
            <li key={item}>・{item}</li>
          ))}
        </ul>
      </Section>

      <div className="border-t border-border pt-6">
        <SaveButtons shopId={shop.id} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-muted">{title}</h2>
      <div className="text-[15px] leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}
