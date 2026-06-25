import Link from "next/link";
import type { Shop } from "@/lib/types";
import SaveButtons from "./SaveButtons";

export default function ShopCard({ shop }: { shop: Shop }) {
  return (
    <article className="border-t border-border py-5 first:border-t-0">
      <Link href={`/shops/${shop.id}`} className="group block">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-lg text-foreground group-hover:text-accent">{shop.name}</h3>
          <span className="shrink-0 text-sm text-muted">¥{shop.budgetMin}〜{shop.budgetMax}</span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {shop.area} ・ {shop.station} ・ {shop.genres.join(" / ")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">{shop.whyThisShop}</p>
      </Link>
      <div className="mt-3">
        <SaveButtons shopId={shop.id} size="sm" />
      </div>
    </article>
  );
}
