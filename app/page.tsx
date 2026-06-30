import Link from "next/link";
import { resolveShelves } from "@/lib/shelves";
import { getRecentApprovedPosts } from "@/lib/posts";
import { getShopById } from "@/lib/shops";
import ShelfRow from "@/components/ShelfRow";
import PostList from "@/components/PostList";
import PhotoCallout from "@/components/PhotoCallout";

// 最近の実食ログを反映するため ISR
export const revalidate = 60;

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "日吉", href: "/shops?area=日吉" },
  { label: "三田・田町", href: "/shops?area=三田" },
  { label: "横浜", href: "/shops?area=横浜" },
  { label: "家系", href: "/shops?genre=家系" },
  { label: "二郎系", href: "/shops?genre=二郎系" },
  { label: "一人飯", href: "/shops?scene=solo" },
  { label: "腹パン", href: "/shops?scene=hearty" },
  { label: "飲み後", href: "/shops?scene=after_drinking" },
];

// トップに出す代表的な棚（残りは /shops で）
const HOME_SHELF_IDS = ["hiyoshi-after-class", "solo", "first-iekei", "after-drinking"];

export default async function Home() {
  const homeShelves = resolveShelves(HOME_SHELF_IDS, 5);
  const recentPosts = await getRecentApprovedPosts(4);

  return (
    <div className="flex flex-col gap-12 py-4">
      <section className="border-b border-border pb-10">
        <p className="text-xs font-semibold tracking-widest text-accent">KEIO RAMEN GUIDE</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
          授業終わり、
          <br className="sm:hidden" />
          どこ啜る？
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          日吉・三田・横浜。慶應生の実食ログで育つラーメンガイド。価格も、量も、雰囲気も、食べた人の一言でわかる。
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/shops"
            className="rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            店舗を探す
          </Link>
          <Link
            href="/quiz"
            className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground"
          >
            気分で選ぶ
          </Link>
          <Link href="/post" className="text-sm font-medium text-accent hover:underline">
            食べたら投稿する →
          </Link>
        </div>

        <div className="mt-7">
          <p className="mb-2 text-xs font-semibold text-muted">すぐ探す</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full border border-border px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-foreground">用途別ベスト棚</h2>
        <Link href="/shops" className="text-xs text-muted hover:text-accent">
          全店を見る →
        </Link>
      </div>
      <div className="-mt-6 flex flex-col gap-10">
        {homeShelves.map((shelf) => (
          <ShelfRow key={shelf.id} shelf={shelf} />
        ))}
      </div>

      {recentPosts.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-foreground">最近の実食ログ</h2>
            <Link href="/post" className="text-xs text-muted hover:text-accent">
              投稿する →
            </Link>
          </div>
          <p className="mt-1 text-xs text-muted">慶應生が食べた一杯。タップで店舗の詳細へ。</p>
          <div className="mt-4">
            <PostList posts={recentPosts} />
          </div>
          <ul className="mt-2 text-xs text-muted">
            {recentPosts.map((p) => {
              const s = getShopById(p.shopId);
              return s ? (
                <li key={p.id} className="inline">
                  <Link href={`/shops/${s.id}`} className="mr-3 hover:text-accent">
                    {s.name} →
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-base font-bold text-foreground">ランキングではなく、今いる場所と生活シーンで選ぶ</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          広告なし・軽量・スマホファースト。全国の網羅性や点数では勝負しません。授業後・空きコマ・一人飯・飲み後といった慶應生の生活シーンから、日吉・三田・横浜の「今日行く一杯」を早く決められることだけに集中しています。
        </p>
        <p className="mt-3 text-xs text-muted">
          写真は無断転載しません。掲載できる写真がない店は「写真募集中」と表示し、初回注文・価格・用途・並びの情報で選べるようにしています。
        </p>
        <Link href="/shops" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
          店舗を探す →
        </Link>
      </section>

      <PhotoCallout />
    </div>
  );
}
