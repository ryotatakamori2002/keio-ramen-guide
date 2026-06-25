import Link from "next/link";
import { SHOPS } from "@/lib/shops";
import ShopCard from "@/components/ShopCard";

const QUICK_FILTERS: { label: string; href: string }[] = [
  { label: "日吉", href: "/shops?area=日吉" },
  { label: "三田", href: "/shops?area=三田" },
  { label: "横浜", href: "/shops?area=横浜" },
  { label: "家系", href: "/shops?genre=家系" },
  { label: "二郎系", href: "/shops?genre=二郎系" },
  { label: "一人飯", href: "/shops?scene=solo" },
  { label: "飲み後", href: "/shops?scene=after_drinking" },
  { label: "初心者向け", href: "/shops?beginner=1" },
];

export default function Home() {
  const featured = [...SHOPS].sort((a, b) => b.keioStudentScore - a.keioStudentScore).slice(0, 5);

  return (
    <div className="flex flex-col gap-16 py-6">
      <section>
        <p className="text-xs tracking-widest text-accent">慶應生のためのラーメンガイド</p>
        <h1 className="mt-3 font-serif text-3xl leading-snug text-foreground sm:text-4xl">
          授業終わりに、
          <br />
          外さない一杯を。
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          日吉・三田・横浜のラーメンを、慶應生目線で。
        </p>
        <div className="mt-7 flex items-center gap-6">
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
      </section>

      <section>
        <div className="flex flex-wrap gap-2 text-sm">
          {QUICK_FILTERS.map((f) => (
            <Link
              key={f.label}
              href={f.href}
              className="rounded-full border border-border px-3.5 py-1.5 text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {f.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="font-serif text-xl text-foreground">よく選ばれる店</h2>
          <Link href="/shops" className="text-xs text-muted hover:text-accent">
            すべて見る →
          </Link>
        </div>
        <div>
          {featured.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      <section className="border-t border-accent-soft pt-6">
        <p className="font-serif text-base leading-loose text-foreground/90">
          ラーメンDBは詳しい人のためのもの。これは、慶應生が「今いる場所」と「今の気分」で選ぶための小さなガイドです。
          <br />
          網羅性やランキングでは勝負しません。日吉・三田・横浜という生活圏だけを、丁寧に。
        </p>
      </section>
    </div>
  );
}
