import Link from "next/link";
import { getApprovedPostMeta, getRecentApprovedPosts } from "@/lib/posts";
import { getKeioPicks } from "@/lib/picks";
import { getShopById, VISIBLE_SHOPS } from "@/lib/shops";
import { copy } from "@/content/site-copy";
import { button, type } from "@/lib/design";
import HeroPhoto from "@/components/visual/HeroPhoto";
import CampusGuide from "@/components/CampusGuide";
import SceneGuide from "@/components/SceneGuide";
import PostInvite from "@/components/PostInvite";
import KeioPicks from "@/components/KeioPicks";
import PostList from "@/components/PostList";
import FadeIn from "@/components/motion/FadeIn";
import AnimatedText from "@/components/motion/AnimatedText";

export const revalidate = 60;

// Heroの「今日の一杯」。今は固定1店、写真が増えたらローテーションにする。
const FEATURED_SHOP_ID = "yokohama-ishinshoten";

export default async function Home() {
  const featured = getShopById(FEATURED_SHOP_ID);
  // Picks: 投稿ゼロの間は手動順位、承認投稿が付いたら投稿数順が自然に上位になる（lib/picks.ts）
  const postMeta = await getApprovedPostMeta();
  const picks = getKeioPicks({
    postCounts: Object.fromEntries(Object.entries(postMeta).map(([id, m]) => [id, m.count])),
  });
  const recentPosts = await getRecentApprovedPosts(4);
  const counts = Object.fromEntries(
    copy.campus.areas.map((a) => [a.id, VISIBLE_SHOPS.filter((s) => s.area === a.id).length]),
  );

  return (
    <div className="flex flex-col gap-16 pb-4 sm:gap-24">
      {/* 1. Hero — 実写真が主役。左は暗色パネルのコピー、右は維新商店の一杯 */}
      <Bleed className="theme-hero -mt-6 overflow-hidden">
        <div className="grid lg:grid-cols-[minmax(0,42%)_1fr]">
          <div className="relative z-10 flex items-center">
            <div className="w-full px-5 py-9 sm:px-8 sm:py-14 lg:py-24 lg:pl-[max(2rem,calc((100vw-64rem)/2))] lg:pr-12">
              <p className={type.eyebrow}>{copy.hero.eyebrow}</p>
              {/* break-keep はCJKの折返しを禁じ、iOS Safariで見出しが右にはみ出すため使わない */}
              <h1 className={`mt-4 max-w-[22ch] ${type.display}`}>
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
          </div>
          {featured && <HeroPhoto shop={featured} />}
        </div>
      </Bleed>

      {/* 2. Campus Guide — エリアを生活圏の特集リードとして見せる */}
      <Section label={copy.campus.label} title={copy.campus.title}>
        <FadeIn className="mt-6">
          <CampusGuide counts={counts} />
        </FadeIn>
      </Section>

      {/* 4. Keio Picks — ポスターの壁 */}
      <Section label={copy.picks.label} title={copy.picks.title} subtitle={copy.picks.subtitle}>
        <FadeIn className="mt-7">
          <KeioPicks shops={picks} />
        </FadeIn>
      </Section>

      {/* 5. Scene Guide — 表面色の帯 */}
      <Bleed className="theme-surface border-y border-border">
        <Container className="py-12 sm:py-14">
          <FadeIn>
            <p className={type.eyebrow}>{copy.curated.label}</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground">{copy.curated.title}</h2>
          </FadeIn>
          <FadeIn>
            <div className="mt-6">
              <SceneGuide />
            </div>
            <Link
              href="/shops"
              className="mt-6 inline-block text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-accent"
            >
              {copy.curated.viewAll} →
            </Link>
          </FadeIn>
        </Container>
      </Bleed>

      {/* 6. Recent Logs */}
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
          <FadeIn className="mt-6">
            <PostInvite />
          </FadeIn>
        )}
      </Section>

      {/* 7. About */}
      <FadeIn className="border-t border-border pt-10">
        <h2 className="text-base font-bold tracking-tight text-foreground">{copy.about.title}</h2>
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-loose text-muted">{copy.about.body}</p>
      </FadeIn>
    </div>
  );
}

// 全幅の帯（コンテナの外へ断ち落とす）
function Bleed({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`relative left-1/2 w-screen -translate-x-1/2 ${className}`}>{children}</div>;
}

function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}>{children}</div>;
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
