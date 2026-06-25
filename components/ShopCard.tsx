import Link from "next/link";
import type { Shop } from "@/lib/types";
import SaveButtons from "./SaveButtons";

const BADGE_RULES: { test: (shop: Shop) => boolean; label: string }[] = [
  { test: (s) => s.beginnerFriendly >= 4, label: "初心者OK" },
  { test: (s) => s.soloFriendly >= 4, label: "一人OK" },
  { test: (s) => s.queueLevel <= 2, label: "並び少なめ" },
  { test: (s) => s.volume >= 4, label: "腹パン" },
  { test: (s) => s.lateNight, label: "深夜営業" },
];

export default function ShopCard({ shop }: { shop: Shop }) {
  const badges = BADGE_RULES.filter((rule) => rule.test(shop)).map((rule) => rule.label);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <Link href={`/shops/${shop.id}`} className="block">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-foreground">{shop.name}</h3>
          <span className="whitespace-nowrap text-sm font-semibold text-accent-dark">
            ¥{shop.budgetMin}〜{shop.budgetMax}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted">
          {shop.area} ・ {shop.station}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {shop.genres.map((genre) => (
            <span key={genre} className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-dark">
              {genre}
            </span>
          ))}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{shop.tasteNotes}</p>
        {badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <span key={badge} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">
                {badge}
              </span>
            ))}
          </div>
        )}
      </Link>
      <div className="mt-3">
        <SaveButtons shopId={shop.id} size="sm" />
      </div>
    </div>
  );
}
