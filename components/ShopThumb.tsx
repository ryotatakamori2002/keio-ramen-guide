import Image from "next/image";
import type { VisualTone } from "@/lib/types";

// 写真がない店は「偽のラーメン写真」を出さない。
// ごく薄い背景色＋小さなアイコン＋ジャンル名だけの、控えめな識別スロットにする。
const TONE_TINT: Record<VisualTone, string> = {
  iekei: "#f1ece4",
  jiro: "#f4ebe4",
  tanrei: "#eaeeec",
  mazesoba: "#f5efe1",
  tsukemen: "#f4e9df",
  miso: "#f1ebdd",
  other: "#eeeeea",
};

export default function ShopThumb({
  genre,
  tone,
  imageUrl,
  imageAlt,
  className = "",
  sizes,
}: {
  genre: string;
  tone: VisualTone;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  sizes?: string;
}) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-md bg-border ${className}`}>
        <Image src={imageUrl} alt={imageAlt ?? ""} fill sizes={sizes ?? "120px"} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-md border border-border ${className}`}
      style={{ background: TONE_TINT[tone] }}
      role="img"
      aria-label={`${genre}（写真なし）`}
    >
      <BowlIcon className="h-5 w-5 text-muted" />
      <span className="px-1 text-center text-xs font-semibold leading-tight text-foreground">{genre}</span>
    </div>
  );
}

function BowlIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden>
      <path d="M3.5 10.5h17" />
      <path d="M4.5 10.5c.4 5 3.6 8 7.5 8s7.1-3 7.5-8" />
      <path d="M14.5 5.5l-3.5 3" opacity="0.7" />
      <path d="M16.5 6.8l-3 2.6" opacity="0.5" />
    </svg>
  );
}
