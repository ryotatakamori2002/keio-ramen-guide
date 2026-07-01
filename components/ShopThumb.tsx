import Image from "next/image";
import { copy } from "@/content/site-copy";

// 写真がある店は写真を表示。ない店は「偽のラーメン写真」を出さず、
// 静かなグレーのプレースホルダーに小さく "No photo yet" とジャンルだけを置く。
export default function ShopThumb({
  genre,
  primaryImageUrl,
  imageAlt,
  className = "",
  sizes,
  showLabel = true,
}: {
  genre: string;
  primaryImageUrl?: string;
  imageAlt?: string;
  className?: string;
  sizes?: string;
  showLabel?: boolean;
}) {
  if (primaryImageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-border ${className}`}>
        <Image src={primaryImageUrl} alt={imageAlt ?? ""} fill sizes={sizes ?? "120px"} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-lg border border-border bg-[#f4f2ee] ${className}`}
      role="img"
      aria-label={`${genre}・${copy.empty.noPhoto}`}
    >
      <span className="text-xs font-medium text-foreground/70">{genre}</span>
      {showLabel && <span className="text-[9px] uppercase tracking-wider text-muted">{copy.empty.noPhoto}</span>}
    </div>
  );
}
