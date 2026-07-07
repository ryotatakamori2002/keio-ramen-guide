import Link from "next/link";
import { resolveShelves, shelfLinks } from "@/lib/shelves";
import { getRecentApprovedPosts } from "@/lib/posts";
import { VISIBLE_SHOPS } from "@/lib/shops";
import { copy } from "@/content/site-copy";
import { button, type } from "@/lib/design";
import AreaLineMap from "@/components/AreaLineMap";
import ShelfList from "@/components/ShelfList";
import PostList from "@/components/PostList";
import FadeIn from "@/components/motion/FadeIn";
import AnimatedText from "@/components/motion/AnimatedText";

export const revalidate = 60;

// トップに出す編集棚。両キャンパスの生活シーンを対で見せる（店の重複が出ない組み合わせにする）。
const HOME_SHELF_IDS = ["hiyoshi-after-class", "mita-lunch"];
const SCENE_LINK_IDS = ["first-iekei", "solo", "after-drinking", "no-queue", "gap-time", "yokohama-nofail", "jiro", "hearty"];

export default async function Home() {
  const shelves = resolveShelves(HOME_SHELF_IDS, 5);
  const links = shelfLinks(SCENE_LINK_IDS);
  const recentPosts = await getRecentApprovedPosts(4);
  const counts = Object.fromEntries(
    copy.lineMap.stations.map((st) => [st.id, VISIBLE_SHOPS.filter((s) => s.area === st.id).length]),
  );

  return (
    <div className="flex flex-col gap-16 py-8 sm:gap-24 sm:py-12">
      {/* 1. Hero — コピー＋沿線図。写真が無くても成立する主役ビジュアル */}
      <section className="grid items-center gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
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
        <FadeIn delay={0.2} y={16}>
          <AreaLineMap counts={counts} />
        </FadeIn>
      </section>

      {/* 2. シーン特集 — 写真に頼らない編集リスト */}
      <Section label={copy.curated.label} title={copy.curated.title}>
        <div className="mt-7 grid gap-x-14 gap-y-12 lg:grid-cols-2">
          {shelves.map((shelf) => (
            <FadeIn key={shelf.id}>
              <ShelfList shelf={shelf} />
            </FadeIn>
          ))}
        </div>
        <FadeIn>
          <div className="mt-9 flex flex-wrap items-center gap-2">
            {links.map((link) => {
              const meta = copy.curated.titles[link.id];
              if (!meta) return null;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className="rounded-full border border-border px-3.5 py-1.5 text-sm text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
                >
                  {meta.ja}
                </Link>
              );
            })}
            <Link
              href="/shops"
              className="px-1 text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-accent"
            >
              {copy.curated.viewAll} →
            </Link>
          </div>
        </FadeIn>
      </Section>

      {/* 3. みんなの投稿 */}
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

      {/* 4. About */}
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
