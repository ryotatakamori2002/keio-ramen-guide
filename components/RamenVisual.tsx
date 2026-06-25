import Image from "next/image";
import type { VisualTone } from "@/lib/types";

// ジャンルごとの配色とラベル。写真がない店でも「どんなラーメンか」が色と文字で伝わるようにする。
const TONE: Record<VisualTone, { from: string; to: string; ink: string; label: string }> = {
  iekei: { from: "#ecdfce", to: "#d3b794", ink: "#5c3a26", label: "家系" },
  jiro: { from: "#ecd5ca", to: "#cf9f8d", ink: "#7c2f20", label: "二郎系" },
  tanrei: { from: "#f4ecd6", to: "#e2cb97", ink: "#8a6526", label: "淡麗" },
  mazesoba: { from: "#f7e8c1", to: "#e8c069", ink: "#96660f", label: "まぜそば" },
  tsukemen: { from: "#f1dabd", to: "#dea66c", ink: "#9c4a1c", label: "つけ麺" },
  miso: { from: "#eedcc0", to: "#d8b67c", ink: "#8a5a24", label: "味噌" },
  other: { from: "#e9e1d4", to: "#cdbda3", ink: "#6b5a44", label: "ラーメン" },
};

export default function RamenVisual({
  tone,
  imageUrl,
  imageAlt,
  label,
  className = "",
  sizes,
  priority = false,
}: {
  tone: VisualTone;
  imageUrl?: string;
  imageAlt?: string;
  /** プレースホルダー右下のラベル。未指定ならジャンル名 */
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const t = TONE[tone];

  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-border ${className}`}>
        <Image
          src={imageUrl}
          alt={imageAlt ?? ""}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 640px) 100vw, 360px"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(145deg, ${t.from}, ${t.to})` }}
      role="img"
      aria-label={`${label ?? t.label}のイメージ`}
    >
      <BowlMark ink={t.ink} />
      <span
        className="absolute bottom-2.5 right-3.5 font-serif text-sm tracking-wide"
        style={{ color: t.ink }}
      >
        {label ?? t.label}
      </span>
    </div>
  );
}

function BowlMark({ ink }: { ink: string }) {
  return (
    <svg
      viewBox="0 0 200 150"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* 湯気 */}
        <path d="M80 42 C74 33 86 29 80 20" opacity="0.45" />
        <path d="M100 38 C94 29 106 25 100 16" opacity="0.45" />
        <path d="M120 42 C114 33 126 29 120 20" opacity="0.45" />
        {/* 丼の縁 */}
        <ellipse cx="100" cy="72" rx="54" ry="12" fill={ink} fillOpacity="0.07" />
        {/* 丼の本体 */}
        <path d="M50 72 C54 110 74 128 100 128 C126 128 146 110 150 72" />
        {/* 高台 */}
        <path d="M85 132 H115" />
        {/* 麺のニュアンス */}
        <path d="M68 70 C80 62 88 78 100 70" opacity="0.7" />
        <path d="M102 71 C112 63 122 77 132 69" opacity="0.7" />
      </g>
      {/* 味玉 */}
      <ellipse cx="119" cy="77" rx="11" ry="8.5" fill="#fff" fillOpacity="0.82" stroke={ink} strokeWidth="1.8" />
      <circle cx="119" cy="77" r="3.6" fill={ink} fillOpacity="0.5" />
      {/* 箸 */}
      <g stroke={ink} strokeWidth="2.2" strokeLinecap="round" opacity="0.6">
        <path d="M150 38 L98 82" />
        <path d="M158 46 L106 88" />
      </g>
    </svg>
  );
}
