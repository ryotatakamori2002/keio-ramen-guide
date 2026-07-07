import Link from "next/link";
import { shelfLinks } from "@/lib/shelves";
import { getRecentApprovedPosts } from "@/lib/posts";
import { getShopById, VISIBLE_SHOPS } from "@/lib/shops";
import type { Shop } from "@/lib/types";
import { copy } from "@/content/site-copy";
import { button, type } from "@/lib/design";
import FeaturedBowl from "@/components/FeaturedBowl";
import AreaLineMap from "@/components/AreaLineMap";
import KeioPicks from "@/components/KeioPicks";
import PostList from "@/components/PostList";
import FadeIn from "@/components/motion/FadeIn";
import AnimatedText from "@/components/motion/AnimatedText";

export const revalidate = 60;

// Heroの「今日の一杯」。今は固定1店、投稿が増えたらローテーションにする。
const FEATURED_SHOP_ID = "yokohama-ishinshoten";
// Keio Picks（editorialPriority: must から、エリアとジャンルが重ならないよう編集）。
const PICK_IDS = ["yokohama-ishinshoten", "hiyoshi-musashiya", "mita-jiro", "yokohama-afuri"];
// Scene Guide の6シーン。
const SCENE_IDS = ["hiyoshi-after-class", "mita-lunch", "yokohama-nofail", "solo", "after-drinking", "first-iekei"];

export default async function Home() {
  const featured = getShopById(FEATURED_SHOP_ID);
  const picks = PICK_IDS.map((id) => getShopById(id)).filter((s): s is Shop => Boolean(s));
  const scenes = shelfLinks(SCENE_IDS);
  const recentPosts = await getRecentApprovedPosts(4);
  const counts = Object.fromEntries(
    copy.lineMap.stations.map((st) => [st.id, VISIBLE_SHOPS.filter((s) => s.area === st.id).length]),
  );

  return (
    <div className="flex flex-col gap-16 py-8 sm:gap-24 sm:py-12">
      {/* 1. Hero — 左にコピー、右に今日の一杯（Featured Bowl） */}
      <section className="grid items-center gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div>
          <p className={type.eyebrow}>{copy.hero.eyebrow}</p>
          <h1 className={`mt-4 max-w-[22ch] break-keep ${type.display}`}>
            <AnimatedText text={copy.hero.title} />
          </h1>
          <FadeIn delay={0.12}>
            <p className={`mt-5 max-w-xl text-pretty ${type.lead}`}>{copy.hero.subtitle}</p>
          </FadeIn>
          <FadeIn delay={0.22}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/shops" className={button.primary}>
                {copy.hero.primaryCta}
              </Link>
              <Link href="/post" className={button.secondary}>
                {copy.hero.secondaryCta}
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted">
              {copy.hero.quizLead}{" "}
              <Link href="/quiz" className={button.link}>
                {copy.hero.quizCta} →
              </Link>
            </p>
          </FadeIn>
        </div>
        {featured && (
          <FadeIn delay={0.2} y={16}>
            <FeaturedBowl shop={featured} />
          </FadeIn>
        )}
      </section>

      {/* 2. Area Index — 沿線図（Heroから降ろしてここに置く） */}
      <Section label={copy.lineMap.sectionLabel} title={copy.lineMap.sectionTitle}>
        <FadeIn className="mt-8">
          <AreaLineMap counts={counts} />
        </FadeIn>
      </Section>

      {/* 3. Keio Picks — 数を絞った基準の店 */}
      <Section label={copy.picks.label} title={copy.picks.title} subtitle={copy.picks.subtitle}>
        <FadeIn className="mt-6">
          <KeioPicks shops={picks} />
        </FadeIn>
      </Section>

      {/* 4. Scene Guide — 生活シーンから入る */}
      <Section label={copy.curated.label} title={copy.curated.title}>
        <FadeIn>
          <div className="mt-5 grid sm:grid-cols-2 sm:gap-x-14">
            {scenes.map((scene) => {
              const meta = copy.curated.titles[scene.id];
              if (!meta) return null;
              return (
                <Link
                  key={scene.id}
                  href={scene.href}
                  className="group flex items-center justify-between gap-3 border-b border-border py-3.5"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                      {meta.ja}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">{meta.note}</span>
                  </span>
                  <span aria-hidden className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
          <Link
            href="/shops"
            className="mt-5 inline-block text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-accent"
          >
            {copy.curated.viewAll} →
          </Link>
        </FadeIn>
      </Section>

      {/* 5. Recent Logs */}
      <Section
        label={copy.recentLogs.label}
        title={copy.recentLogs.title}
        subtitle={copy.recentLogs.subtitle}
        action={recentPosts.length > 0 ? { href: "/post", label: copy.recentLogs.viewAll } : undefined}
      >
        {recentPosts.length > 0 ? (
          <FadeIn className="mt-6">
            <PostList posts={recentPosts} />
          </FadeIn>
        ) : (
          <FadeIn>
            <p className="mt-5 text-sm text-muted">
              {copy.recentLogs.empty.title}{" "}
              <Link href="/post" className={button.link}>
                {copy.recentLogs.empty.cta} →
              </Link>
            </p>
          </FadeIn>
        )}
      </Section>

      {/* 6. About */}
      <FadeIn className="border-t border-border pt-10">
        <h2 className="text-base font-bold tracking-tight text-foreground">{copy.about.title}</h2>
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-loose text-muted">{copy.about.body}</p>
      </FadeIn>
    </div>
  );
}

function Section({
  label,
  title,
  subtitle,
  action,
  children,
}: {
  label: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section>
      <FadeIn>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className={type.eyebrow}>{label}</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          {action && (
            <Link href={action.href} className="shrink-0 text-xs font-medium text-muted hover:text-accent">
              {action.label} →
            </Link>
          )}
        </div>
      </FadeIn>
      {children}
    </section>
  );
}
