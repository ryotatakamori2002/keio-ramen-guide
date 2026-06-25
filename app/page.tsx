import Link from "next/link";
import { SHOPS } from "@/lib/shops";
import VisualShopCard from "@/components/VisualShopCard";
import RamenVisual from "@/components/RamenVisual";

const TODAY_LINKS: { label: string; href: string }[] = [
  { label: "日吉で探す", href: "/shops?area=日吉" },
  { label: "三田で探す", href: "/shops?area=三田" },
  { label: "横浜で探す", href: "/shops?area=横浜" },
  { label: "一人飯", href: "/shops?scene=solo" },
  { label: "腹パン", href: "/shops?scene=hearty" },
  { label: "飲み後", href: "/shops?scene=after_drinking" },
];

export default function Home() {
  // 慶應生スコア順に、ただし見た目（ジャンルの色味）が偏らないようトーン重複を避けて4軒選ぶ。
  const featured: typeof SHOPS = [];
  const seenTones = new Set<string>();
  for (const shop of [...SHOPS].sort((a, b) => b.keioStudentScore - a.keioStudentScore)) {
    if (seenTones.has(shop.visualTone)) continue;
    seenTones.add(shop.visualTone);
    featured.push(shop);
    if (featured.length === 4) break;
  }

  return (
    <div className="flex flex-col gap-16 py-6">
      <section className="grid items-center gap-7 sm:grid-cols-2">
        <div className="order-2 sm:order-1">
          <p className="text-xs tracking-widest text-accent">慶應生のためのラーメンガイド</p>
          <h1 className="mt-3 font-serif text-3xl leading-snug text-foreground sm:text-4xl">
            授業終わりに、
            <br />
            外さない一杯を。
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            日吉・三田・横浜のラーメンを、慶應生目線で。
          </p>
          <div className="mt-6 flex items-center gap-5">
            <Link
              href="/shops"
              className="bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              店舗を探す
            </Link>
            <Link href="/quiz" className="text-sm text-muted underline underline-offset-4 hover:text-foreground">
              気分で選ぶ →
            </Link>
          </div>
        </div>
        <div className="order-1 sm:order-2">
          <RamenVisual
            tone="iekei"
            label="日吉・三田・横浜"
            priority
            sizes="(max-width: 640px) 100vw, 360px"
            className="aspect-[4/3] w-full rounded-2xl"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold tracking-wide text-muted">今日はどこで食べる？</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {TODAY_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full border border-border px-4 py-2 text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="font-serif text-xl text-foreground">慶應生に選ばれる4軒</h2>
          <Link href="/shops" className="text-xs text-muted hover:text-accent">
            すべて見る →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {featured.map((shop, i) => (
            <VisualShopCard key={shop.id} shop={shop} priority={i < 2} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-lg text-foreground">ランキングではなく、生活シーンで選ぶ</h2>
        <p className="mt-3 text-sm leading-loose text-foreground/90">
          ラーメンDBは詳しい人のためのもの。全国の網羅性や点数では、ここは勝負しません。
          授業後・空きコマ・一人飯・飲み後といった慶應生の生活シーンから、日吉・三田・横浜の「今日行く一杯」を選べることだけに集中しています。
        </p>
        <Link
          href="/shops"
          className="mt-4 inline-block text-sm font-semibold text-accent underline underline-offset-4"
        >
          店舗を探す →
        </Link>
      </section>
    </div>
  );
}
