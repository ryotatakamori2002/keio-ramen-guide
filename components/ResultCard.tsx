import type { RecommendResult } from "@/lib/recommend";
import VisualShopCard from "./VisualShopCard";

export default function ResultCard({ result, rank }: { result: RecommendResult; rank: number }) {
  const { shop, score, reasons } = result;

  return (
    <VisualShopCard
      shop={shop}
      header={
        <div className="flex flex-col gap-2 border-b border-border pb-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-accent">第{rank}位</span>
            <span className="text-xs text-muted">相性スコア {score}</span>
          </div>
          {reasons.length > 0 && (
            <ul className="flex flex-col gap-0.5 text-xs text-foreground/90">
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
