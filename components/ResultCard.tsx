import type { RecommendResult } from "@/lib/recommend";
import ShopCard from "./ShopCard";

export default function ResultCard({ result, rank }: { result: RecommendResult; rank: number }) {
  const { shop, score, reasons } = result;

  return (
    <ShopCard
      shop={shop}
      header={
        <div className="mb-3 flex flex-col gap-1.5 border-b border-border pb-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-accent">第{rank}位</span>
            <span className="text-xs text-muted">相性 {score}</span>
          </div>
          {reasons.length > 0 && (
            <ul className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-foreground/80">
              {reasons.map((reason) => (
                <li key={reason}>・{reason}</li>
              ))}
            </ul>
          )}
        </div>
      }
    />
  );
}
