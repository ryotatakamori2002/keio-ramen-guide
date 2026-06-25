import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopById, SHOPS } from "@/lib/shops";
import type { SceneTag } from "@/lib/types";
import StatBar from "@/components/StatBar";
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

const SCENE_LABELS: Record<SceneTag, string> = {
  after_class: "授業後",
  gap_time: "空きコマ",
  solo: "一人飯",
  with_friends: "友達と",
  after_club: "サークル後",
  after_drinking: "飲み後",
  hearty: "がっつり",
  no_fail: "失敗したくない時",
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
    <div className="flex flex-col gap-10 pb-10">
      <div>
        <Link href="/shops" className="text-xs text-muted hover:text-accent">
          ← 店舗を探す
        </Link>

        <h1 className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">{shop.name}</h1>
        <p className="mt-2 text-sm text-muted">
          {shop.area} ・ {shop.station} ・ {shop.genres.join(" / ")} ・ ¥{shop.budgetMin}〜{shop.budgetMax}
        </p>
        <a
          href={shop.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-accent underline underline-offset-4"
        >
          Google Mapsで見る
        </a>
      </div>

      <p className="border-y border-border py-5 font-serif text-lg leading-relaxed text-foreground">
        {shop.whyThisShop}
      </p>

      <Section title="慶應生向けコメント">
        <p>{shop.keioNotes}</p>
        <p className="mt-2 text-xs text-muted">{shop.accessNote}</p>
      </Section>

      <Section title="おすすめ注文">
        <p>{shop.recommendedMenu}</p>
      </Section>

      <Section title="味・量・並び・入りやすさ">
        <p>{shop.tasteNotes}</p>
        <p className="mt-2">{shop.atmosphereNotes}</p>
        <div className="mt-4 flex flex-col gap-2.5">
          <StatBar level={shop.richness} label="こってり度" />
          <StatBar level={shop.volume} label="量" />
          <StatBar level={shop.queueLevel} label="並びやすさ" />
          <StatBar level={shop.soloFriendly} label="一人向け" />
          <StatBar level={shop.friendFriendly} label="友達向け" />
        </div>
      </Section>

      <Section title="初心者向け情報">
        <p>{shop.beginnerNotes}</p>
      </Section>

      <Section title="注文ルール・暗黙知">
        <p>{shop.rulesNotes}</p>
      </Section>

      <Section title="どんな時に向いているか">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted">
          {shop.sceneTags.map((tag, i) => (
            <span key={tag}>
              {SCENE_LABELS[tag]}
              {i < shop.sceneTags.length - 1 && " ・"}
            </span>
          ))}
        </div>
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
