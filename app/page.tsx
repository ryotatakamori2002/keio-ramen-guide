import Link from "next/link";
import { SHOPS } from "@/lib/shops";
import ShopCard from "@/components/ShopCard";

const AREAS = ["日吉", "三田", "横浜"];

export default function Home() {
  const featured = [...SHOPS].sort((a, b) => b.keioStudentScore - a.keioStudentScore).slice(0, 3);

  return (
    <div className="flex flex-col gap-10">
      <section className="text-center">
        <p className="text-sm font-semibold text-accent">慶應生向けミニラーメンガイド</p>
        <h1 className="mt-2 text-2xl font-bold leading-snug text-foreground sm:text-3xl">
          授業終わりに、
          <br />
          外さない一杯を。
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          日吉・三田・横浜。空きコマ、一人飯、友達と、サークル後、飲み後。
          <br />
          生活シーンに合わせて、今行くべきラーメン屋がすぐ見つかる。
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/shops"
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-accent-dark"
          >
            店舗一覧を見る
          </Link>
          <Link
            href="/quiz"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            30秒で気分診断する
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-foreground">エリアから探す</h2>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {AREAS.map((area) => (
            <Link
              key={area}
              href={`/shops?area=${encodeURIComponent(area)}`}
              className="rounded-2xl border border-border bg-card py-4 text-center text-sm font-bold text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              {area}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-foreground">慶應生に人気の3軒</h2>
          <Link href="/shops" className="text-xs font-medium text-accent">
            一覧を見る →
          </Link>
        </div>
        <div className="mt-2 flex flex-col gap-3">
          {featured.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted">
          広告なし・口コミ件数勝負なし。慶應生の生活導線に合わせて選べる、軽量なラーメン案内です。
        </p>
      </section>
    </div>
  );
}
