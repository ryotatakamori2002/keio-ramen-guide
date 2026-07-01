import Link from "next/link";
import Image from "next/image";
import { resolveShelves } from "@/lib/shelves";
import { getRecentApprovedPosts } from "@/lib/posts";
import { getShopById, READY_SHOPS } from "@/lib/shops";
import { copy } from "@/content/site-copy";
import { button, type } from "@/lib/design";
import ShelfRow from "@/components/ShelfRow";
import PostList from "@/components/PostList";
import type { RamenPost } from "@/lib/types";

// 最近の実食ログを反映するため ISR
export const revalidate = 60;

const HOME_SHELF_IDS = ["hiyoshi-after-class", "solo", "after-drinking", "first-iekei"];

export default async function Home() {
  const homeShelves = resolveShelves(HOME_SHELF_IDS, 5);
  const recentPosts = await getRecentApprovedPosts(4);
  const heroPost = recentPosts.find((p) => p.imageUrl) ?? recentPosts[0] ?? null;

  const areaCount = (id: string) => READY_SHOPS.filter((s) => s.area === id).length;

  return (
    <div className="flex flex-col gap-16 py-6 sm:gap-24 sm:py-10">
      {/* 1. Editorial Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className={type.eyebrow}>{copy.hero.eyebrow}</p>
          <h1 className={`mt-5 whitespace-pre-line ${type.display}`}>{copy.hero.title}</h1>
          <p className={`mt-6 max-w-md ${type.lead}`}>{copy.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/shops" className={button.primary}>
              {copy.hero.primaryCta}
            </Link>
            <Link href="/post" className={button.secondary}>
              {copy.hero.secondaryCta}
            </Link>
          </div>
        </div>
        <HeroVisual post={heroPost} />
      </section>

      {/* 2. Area Index */}
      <section>
        <SectionHead label={copy.sections.area.label} title={copy.sections.area.title} />
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {copy.areas.map((area) => (
            <Link
              key={area.id}
              href={`/shops?area=${encodeURIComponent(area.id)}`}
              className="group flex flex-col bg-card p-5 transition-colors hover:bg-[#f6f4f0]"
            >
              <span className={type.eyebrow}>{area.en}</span>
              <span className="mt-2 text-xl font-bold tracking-tight text-foreground">{area.name}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{area.note}</span>
              <span className="mt-4 flex items-center justify-between text-xs text-muted">
                <span>{areaCount(area.id)} shops</span>
                <span className="text-foreground group-hover:text-accent">View shops →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. The Logs */}
      <section>
        <div className="flex items-end justify-between gap-3">
          <SectionHead label={copy.sections.logs.label} title={copy.sections.logs.title} subtitle={copy.sections.logs.subtitle} />
          <Link href="/post" className="shrink-0 text-xs text-muted hover:text-accent">
            Add a Log →
          </Link>
        </div>
        <div className="mt-6">
          {recentPosts.length > 0 ? (
            <>
              <PostList posts={recentPosts} />
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                {recentPosts.map((p) => {
                  const s = getShopById(p.shopId);
                  return s ? (
                    <Link key={p.id} href={`/shops/${s.id}`} className="hover:text-accent">
                      {s.name} →
                    </Link>
                  ) : null;
                })}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
              <p className={type.eyebrow}>{copy.empty.noPhoto}</p>
              <p className="mt-3 text-sm text-muted">{copy.detail.logsEmpty}</p>
              <Link href="/post" className={`${button.link} mt-3 inline-block`}>
                {copy.detail.logsEmptyCta} →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. Curated Shelves */}
      <section>
        <div className="flex items-end justify-between gap-3">
          <SectionHead label={copy.sections.shelves.label} title={copy.sections.shelves.title} />
          <Link href="/shops" className="shrink-0 text-xs text-muted hover:text-accent">
            All shops →
          </Link>
        </div>
        <div className="mt-8 flex flex-col gap-12">
          {homeShelves.map((shelf) => (
            <ShelfRow key={shelf.id} shelf={shelf} />
          ))}
        </div>
      </section>

      {/* 5. About */}
      <section className="border-t border-border pt-10">
        <SectionHead label={copy.sections.about.label} title={copy.sections.about.title} />
        <p className="mt-4 max-w-2xl text-sm leading-loose text-muted">{copy.about}</p>
        <Link href="/shops" className={`${button.link} mt-4 inline-block`}>
          Explore →
        </Link>
      </section>
    </div>
  );
}

function SectionHead({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div>
      <p className={type.eyebrow}>{label}</p>
      <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

function HeroVisual({ post }: { post: RamenPost | null }) {
  if (post?.imageUrl) {
    const shop = getShopById(post.shopId);
    return (
      <Link href={shop ? `/shops/${shop.id}` : "/shops"} className="group block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-border">
          <Image src={post.imageUrl} alt={post.menuName} fill sizes="(max-width: 1024px) 100vw, 480px" className="object-cover" priority />
        </div>
        <p className="mt-3 text-xs text-muted">
          {post.menuName}
          {shop && ` · ${shop.name}`}
        </p>
      </Link>
    );
  }
  // 写真がまだない時も、押し付けず静かな空状態にする
  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-[#f4f2ee]">
      <p className={type.eyebrow}>{copy.empty.noPhoto}</p>
      <Link href="/post" className={button.small}>
        {copy.hero.secondaryCta}
      </Link>
    </div>
  );
}
