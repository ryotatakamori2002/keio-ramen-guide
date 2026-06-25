import Link from "next/link";
import { SHOPS } from "@/lib/shops";
import ShopCard from "@/components/ShopCard";

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "日吉", href: "/shops?area=日吉" },
  { label: "三田", href: "/shops?area=三田" },
  { label: "横浜", href: "/shops?area=横浜" },
  { label: "家系", href: "/shops?genre=家系" },
  { label: "二郎系", href: "/shops?genre=二郎系" },
  { label: "一人飯", href: "/shops?scene=solo" },
  { label: "腹パン", href: "/shops?scene=hearty" },
  { label: "飲み後", href: "/shops?scene=after_drinking" },
];

export default function Home() {
  // 慶應生スコア順に、トーン（ジャンルの色味）が偏らないよう3軒選ぶ。
  const picks: typeof SHOPS = [];
  const seenTones = new Set<string>();
  for (const shop of [...SHOPS].sort((a, b) => b.keioStudentScore - a.keioStudentScore)) {
    if (seenTones.has(shop.visualTone)) continue;
    seenTones.add(shop.visualTone);
    picks.push(shop);
    if (picks.length === 3) break;
  }

  return (
    <div className="flex flex-col gap-14 py-4">
      <section className="border-b border-border pb-10">
        <p className="text-xs font-semibold tracking-widest text-accent">KEIO RAMEN GUIDE</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
          授業終わり、
          <br className="sm:hidden" />
          どこ啜る？
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          日吉・三田・横浜。慶應生のためのラーメン案内。
          <br className="hidden sm:block" />
          今いる場所と気分から、今日行く一杯を選べる。
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

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-foreground">今日の候補</h2>
          <Link href="/shops" className="text-xs text-muted hover:text-accent">
            すべて見る →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-base font-bold text-foreground">ランキングではなく、今いる場所と生活シーンで選ぶ</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          ラーメンDBは詳しい人のためのもの。全国の網羅性や点数では、ここは勝負しません。授業後・空きコマ・一人飯・飲み後といった慶應生の生活シーンから、日吉・三田・横浜の「今日行く一杯」を選べることだけに集中しています。
        </p>
        <Link href="/shops" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
          店舗を探す →
        </Link>
      </section>
    </div>
  );
}
