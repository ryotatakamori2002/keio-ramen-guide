import Image from "next/image";
import type { PhotoStatus, VisualTone } from "@/lib/types";

// 写真がある店は写真を表示。ない店は「偽のラーメン写真風イラスト」を出さず、
// ごく薄いジャンル色のスロットに小さなアイコン＋ジャンル名、そして写真の状態だけを示す。
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
  primaryImageUrl,
  imageAlt,
  photoStatus,
  photoNeeded,
  className = "",
  sizes,
  showPhotoLabel = true,
}: {
  genre: string;
  tone: VisualTone;
  primaryImageUrl?: string;
  imageAlt?: string;
  photoStatus: PhotoStatus;
  photoNeeded: boolean;
  className?: string;
  sizes?: string;
  showPhotoLabel?: boolean;
}) {
  if (primaryImageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-md bg-border ${className}`}>
        <Image src={primaryImageUrl} alt={imageAlt ?? ""} fill sizes={sizes ?? "120px"} className="object-cover" />
      </div>
    );
  }

  const label = photoNeeded || photoStatus === "none" ? "写真募集中" : "写真未取得";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-md border border-border ${className}`}
      style={{ background: TONE_TINT[tone] }}
      role="img"
      aria-label={`${genre}（写真なし・${label}）`}
    >
      <BowlIcon className="h-4 w-4 text-muted" />
      <span className="px-1 text-center text-xs font-semibold leading-tight text-foreground">{genre}</span>
      {showPhotoLabel && <span className="text-[9px] leading-none text-muted">{label}</span>}
    </div>
  );
}

function BowlIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden>
      <path d="M3.5 10.5h17" />
      <path d="M4.5 10.5c.4 5 3.6 8 7.5 8s7.1-3 7.5-8" />
      <path d="M14.5 5.5l-3.5 3" opacity="0.7" />
    </svg>
  );
}
