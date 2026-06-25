import Link from "next/link";
import type { RecommendResult } from "@/lib/recommend";
import LevelDots from "./LevelDots";
import SaveButtons from "./SaveButtons";

export default function ResultCard({ result, rank }: { result: RecommendResult; rank: number }) {
  const { shop, score, reasons } = result;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-accent">第{rank}位</span>
          <h3 className="text-base font-bold text-foreground">{shop.name}</h3>
          <p className="mt-0.5 text-xs text-muted">
            {shop.area} ・ {shop.genres.join(" / ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">相性スコア</p>
          <p className="text-lg font-bold text-accent-dark">{score}</p>
        </div>
      </div>

      <p className="mt-1 text-sm font-semibold text-accent-dark">
        ¥{shop.budgetMin}〜{shop.budgetMax}
      </p>

      {reasons.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {reasons.map((reason) => (
            <li key={reason} className="text-sm text-foreground/80">
              ・{reason}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 rounded-xl bg-background p-3 sm:grid-cols-2">
        <LevelDots level={shop.beginnerFriendly} label="初心者向け度" />
        <LevelDots level={shop.soloFriendly} label="一人向け度" />
        <LevelDots level={shop.volume} label="腹パン度" />
        <LevelDots level={shop.queueLevel} label="並びレベル" />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <SaveButtons shopId={shop.id} size="sm" />
        <div className="flex gap-2">
          <Link
            href={`/shops/${shop.id}`}
            className="flex-1 rounded-full border border-border py-2 text-center text-sm font-medium text-foreground hover:border-accent hover:text-accent"
          >
            詳細を見る
          </Link>
          <a
            href={shop.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full border border-border py-2 text-center text-sm font-medium text-foreground hover:border-accent hover:text-accent"
          >
            Google Mapsで開く
          </a>
        </div>
      </div>
    </div>
  );
}
