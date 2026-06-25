import Link from "next/link";
import type { RecommendResult } from "@/lib/recommend";
import StatBar from "./StatBar";
import SaveButtons from "./SaveButtons";

export default function ResultCard({ result, rank }: { result: RecommendResult; rank: number }) {
  const { shop, score, reasons } = result;

  return (
    <article className="border-t border-border py-6 first:border-t-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-accent">
          第{rank}位 <span className="text-muted">・ 相性 {score}</span>
        </span>
        <span className="text-sm text-muted">¥{shop.budgetMin}〜{shop.budgetMax}</span>
      </div>
      <h3 className="mt-1 font-serif text-lg text-foreground">{shop.name}</h3>
      <p className="mt-1 text-sm text-muted">
        {shop.area} ・ {shop.genres.join(" / ")}
      </p>

      {reasons.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1 text-sm text-foreground/90">
          {reasons.map((reason) => (
            <li key={reason}>・{reason}</li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <StatBar level={shop.beginnerFriendly} label="初心者向け" />
        <StatBar level={shop.soloFriendly} label="一人向け" />
        <StatBar level={shop.volume} label="量" />
        <StatBar level={shop.queueLevel} label="並びやすさ" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <SaveButtons shopId={shop.id} size="sm" />
        <div className="flex gap-4 text-sm">
          <Link href={`/shops/${shop.id}`} className="text-foreground underline underline-offset-4 hover:text-accent">
            詳細を見る
          </Link>
          <a
            href={shop.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted underline underline-offset-4 hover:text-accent"
          >
            Google Maps
          </a>
        </div>
      </div>
    </article>
  );
}
