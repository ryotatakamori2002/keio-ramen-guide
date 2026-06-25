import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopById, SHOPS } from "@/lib/shops";
import type { SceneTag } from "@/lib/types";
import LevelDots from "@/components/LevelDots";
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

const SCENE_FIT_ROWS: { tag: SceneTag; label: string }[] = [
  { tag: "after_class", label: "授業後に向いているか" },
  { tag: "gap_time", label: "空きコマで行けるか" },
  { tag: "after_club", label: "サークル後に向いているか" },
  { tag: "after_drinking", label: "飲み後に向いているか" },
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
    <div className="flex flex-col gap-5 pb-6">
      <div>
        <Link href="/shops" className="text-xs font-medium text-accent">
          ← 店舗一覧に戻る
        </Link>
        <h1 className="mt-2 text-xl font-bold text-foreground">{shop.name}</h1>
        <p className="mt-1 text-sm text-muted">
          {shop.area} ・ {shop.station}（キャンパスから徒歩約{shop.campusWalkMin}分）
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {shop.genres.map((genre) => (
            <span key={genre} className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-dark">
              {genre}
            </span>
          ))}
        </div>
        <p className="mt-2 text-sm font-semibold text-accent-dark">
          予算 ¥{shop.budgetMin}〜{shop.budgetMax}
        </p>
      </div>

      <SaveButtons shopId={shop.id} />

      <Section title="おすすめメニュー">
        <p className="text-sm text-foreground/90">{shop.recommendedMenu}</p>
      </Section>

      <Section title="味の特徴">
        <p className="text-sm leading-relaxed text-foreground/90">{shop.tasteNotes}</p>
      </Section>

      <Section title="店の雰囲気">
        <p className="text-sm leading-relaxed text-foreground/90">{shop.atmosphereNotes}</p>
      </Section>

      <Section title="慶應生向けコメント">
        <p className="text-sm leading-relaxed text-foreground/90">{shop.keioNotes}</p>
      </Section>

      <Section title="初心者向けコメント">
        <p className="text-sm leading-relaxed text-foreground/90">{shop.beginnerNotes}</p>
      </Section>

      <Section title="注文ルール・暗黙知">
        <p className="text-sm leading-relaxed text-foreground/90">{shop.rulesNotes}</p>
      </Section>

      <Section title="入りやすさ・混雑感">
        <div className="flex flex-col gap-2 rounded-xl bg-card p-3">
          <LevelDots level={shop.soloFriendly} label="一人で入りやすいか" />
          <LevelDots level={shop.friendFriendly} label="友達と行きやすいか" />
          <LevelDots level={shop.beginnerFriendly} label="初心者向け度" />
          <LevelDots level={shop.queueLevel} label="並び・混雑感" />
        </div>
      </Section>

      <Section title="生活シーン適性">
        <div className="grid grid-cols-2 gap-2">
          {SCENE_FIT_ROWS.map((row) => {
            const fits = shop.sceneTags.includes(row.tag);
            return (
              <div
                key={row.tag}
                className={`rounded-xl border px-3 py-2 text-xs font-medium ${
                  fits ? "border-accent bg-accent-soft text-accent-dark" : "border-border text-muted"
                }`}
              >
                {fits ? "◎ " : "△ "}
                {row.label}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="どんな人におすすめか">
        <ul className="flex flex-col gap-1">
          {shop.recommendedFor.map((item) => (
            <li key={item} className="text-sm text-foreground/90">
              ・{item}
            </li>
          ))}
        </ul>
      </Section>

      <div className="flex flex-col gap-2">
        <a
          href={shop.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border bg-card py-3 text-center text-sm font-bold text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Google Mapsで開く
        </a>
        {shop.officialUrl && (
          <a
            href={shop.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-card py-3 text-center text-sm font-bold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            公式サイトを見る
          </a>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-1.5 text-sm font-bold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
