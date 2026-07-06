import Link from "next/link";
import Image from "next/image";
import { resolveShelves } from "@/lib/shelves";
import { getRecentApprovedPosts } from "@/lib/posts";
import { getShopById, READY_SHOPS } from "@/lib/shops";
import { copy } from "@/content/site-copy";
import { button, type } from "@/lib/design";
import ShelfRow from "@/components/ShelfRow";
import PostList from "@/components/PostList";
import FadeIn from "@/components/motion/FadeIn";
import Stagger from "@/components/motion/Stagger";
import AnimatedText from "@/components/motion/AnimatedText";
import MagneticButton from "@/components/motion/MagneticButton";
import type { RamenPost } from "@/lib/types";

export const revalidate = 60;

const HOME_SHELF_IDS = ["hiyoshi-after-class", "solo", "after-drinking", "first-iekei"];

export default async function Home() {
  const homeShelves = resolveShelves(HOME_SHELF_IDS, 5);
  const recentPosts = await getRecentApprovedPosts(4);
  const heroPost = recentPosts.find((p) => p.imageUrl) ?? null;
  const areaCount = (id: string) => READY_SHOPS.filter((s) => s.area === id).length;

  return (
    <div className="flex flex-col gap-20 py-8 sm:gap-28 sm:py-12">
      {/* 1. Hero — 写真があれば2カラム、なければテキスト中心（巨大な空カードは出さない） */}
      <section className={heroPost ? "grid items-center gap-10 lg:grid-cols-2" : ""}>
        <div className={heroPost ? "" : "max-w-2xl"}>
          <p className={type.eyebrow}>{copy.brandLine}</p>
          <h1 className={`mt-5 max-w-[20ch] break-keep ${type.display}`}>
            <AnimatedText text={copy.hero.title} />
          </h1>
          <FadeIn delay={0.15}>
            <p className={`mt-6 max-w-xl text-pretty ${type.lead}`}>{copy.hero.subtitle}</p>
          </FadeIn>
          <FadeIn delay={0.28}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton>
                <Link href="/shops" className={button.primary}>
                  {copy.hero.primaryCta}
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/post" className={button.secondary}>
                  {copy.hero.secondaryCta}
                </Link>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>
        {heroPost && <HeroVisual post={heroPost} />}
      </section>

      {/* 2. Area Index */}
      <Section label={copy.areaIndex.label} title={copy.areaIndex.title}>
        <Stagger className="mt-6 grid gap-4 sm:grid-cols-3" gap={0.08}>
          {copy.areaIndex.areas.map((area) => (
            <Link
              key={area.id}
              href={`/shops?area=${encodeURIComponent(area.id)}`}
              className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/25"
            >
              <span className={type.eyebrow}>{area.en}</span>
              <span className="mt-2 text-xl font-bold tracking-tight text-foreground">{area.name}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{area.note}</span>
              <span className="mt-5 flex items-center justify-between text-xs">
                <span className="text-muted">{copy.areaIndex.shopsCount(areaCount(area.id))}</span>
                <span className="font-medium text-foreground group-hover:text-accent">
                  {copy.areaIndex.viewShops} →
                </span>
              </span>
            </Link>
          ))}
        </Stagger>
      </Section>

      {/* 3. Recent Logs */}
      <Section
        label={copy.recentLogs.label}
        title={copy.recentLogs.title}
        subtitle={copy.recentLogs.subtitle}
        action={{ href: "/post", label: copy.recentLogs.viewAll }}
      >
        {recentPosts.length > 0 ? (
          <FadeIn className="mt-6">
            <PostList posts={recentPosts} />
          </FadeIn>
        ) : (
          <p className="mt-4 text-sm text-muted">
            {copy.recentLogs.empty.title}{" "}
            <Link href="/post" className={button.link}>
              {copy.recentLogs.empty.cta} →
            </Link>
          </p>
        )}
      </Section>

      {/* 4. Curated */}
      <Section label={copy.curated.label} title={copy.curated.title}>
        <div className="mt-8 flex flex-col gap-14">
          {homeShelves.map((shelf) => (
            <FadeIn key={shelf.id}>
              <ShelfRow shelf={shelf} />
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* 5. About */}
      <FadeIn className="border-t border-border pt-12">
        <p className={type.eyebrow}>{copy.about.label}</p>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground">{copy.about.title}</h2>
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-loose text-muted">{copy.about.body}</p>
        <Link href="/shops" className={`${button.link} mt-4 inline-block`}>
          {copy.hero.primaryCta} →
        </Link>
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

function HeroVisual({ post }: { post: RamenPost }) {
  const shop = post.shopId ? getShopById(post.shopId) : null;
  return (
    <FadeIn delay={0.2}>
      <Link href={shop ? `/shops/${shop.id}` : "/shops"} className="group block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-border">
          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              alt={post.menuName}
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority
            />
          )}
        </div>
        <p className="mt-3 text-xs text-muted">
          {post.menuName}
          {shop && ` · ${shop.name}`}
        </p>
      </Link>
    </FadeIn>
  );
}
