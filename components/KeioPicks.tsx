import Image from "next/image";
import Link from "next/link";
import type { Shop } from "@/lib/types";
import { copy } from "@/content/site-copy";
import PriceNote from "./PriceNote";

// Keio Picks。写真のある店は写真を主役に、大小を混ぜた誌面のリズムで並べる。
// 写真のない店は情報プレートとして1枠に収める（カードの反復にしない）。
const SPAN = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];
const RATIO = ["aspect-[16/9] lg:aspect-[16/10]", "aspect-[4/3] lg:aspect-square", "aspect-[16/9]", ""];

export default function KeioPicks({ shops }: { shops: Shop[] }) {
  return (
    <div className="grid gap-x-6 gap-y-10 lg:grid-cols-6">
      {shops.map((shop, i) => {
        const photo = i === 1 ? (shop.squareImageUrl ?? shop.heroImageUrl) : (shop.heroImageUrl ?? shop.thumbnailImageUrl);
        return photo ? (
          <PhotoPick key={shop.id} shop={shop} photo={photo} index={i} />
        ) : (
          <InfoPick key={shop.id} shop={shop} index={i} />
        );
      })}
    </div>
  );
}

function PhotoPick({ shop, photo, index }: { shop: Shop; photo: string; index: number }) {
  return (
    <article className={`group ${SPAN[index] ?? "lg:col-span-3"}`}>
      <Link href={`/shops/${shop.id}`} className="block">
        <div className={`relative overflow-hidden ${RATIO[index] || "aspect-[16/9]"}`}>
          <Image
            src={photo}
            alt={shop.imageAlt ?? shop.name}
            fill
            sizes={index === 0 ? "(max-width: 1024px) 100vw, 680px" : "(max-width: 1024px) 100vw, 400px"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute left-0 top-0 bg-accent px-2.5 py-1 text-xs font-bold tabular-nums text-white">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3 pt-3">
          <h3
            className={`min-w-0 truncate font-bold tracking-tight text-foreground transition-colors group-hover:text-accent ${
              index === 0 ? "text-xl" : "text-lg"
            }`}
          >
            {shop.name}
          </h3>
          <span className="shrink-0 text-[11px] text-muted">
            {shop.area} · {shop.genres[0]}
          </span>
        </div>
        <p className={`mt-1.5 text-sm leading-relaxed text-foreground/85 ${index === 0 ? "" : "line-clamp-2"}`}>
          {shop.selectionReason}
        </p>
        <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-2.5">
          <PriceNote name={shop.firstVisitOrder} price={shop.firstVisitPrice} confidence={shop.priceConfidence} />
          <span className="text-xs font-medium text-muted transition-colors group-hover:text-accent">
            {copy.picks.detail} →
          </span>
        </div>
      </Link>
    </article>
  );
}

function InfoPick({ shop, index }: { shop: Shop; index: number }) {
  return (
    <article className={`${SPAN[index] ?? "lg:col-span-3"}`}>
      <Link
        href={`/shops/${shop.id}`}
        className="group flex h-full flex-col border border-foreground/60 bg-card p-5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-bold tabular-nums text-accent">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-[11px] text-muted">
            {shop.area} · {shop.genres.join("/")}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
          {shop.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">{shop.selectionReason}</p>
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-3">
          <PriceNote name={shop.firstVisitOrder} price={shop.firstVisitPrice} confidence={shop.priceConfidence} />
          <span className="text-xs font-medium text-muted transition-colors group-hover:text-accent">
            {copy.picks.detail} →
          </span>
        </div>
      </Link>
    </article>
  );
}
