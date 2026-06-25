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
      <BowlMark ink={t.ink} tone={tone} />
      <span
        className="absolute bottom-2.5 right-3.5 font-serif text-sm tracking-wide"
        style={{ color: t.ink }}
      >
        {label ?? t.label}
      </span>
    </div>
  );
}

// 丼の本体は共通モチーフとして保ちつつ、トッピングと湯気/汁の有無をジャンルで変える。
// 色（tone）と合わせて「どんなラーメンか」が一目で伝わるようにするのが狙い。
function BowlMark({ ink, tone }: { ink: string; tone: VisualTone }) {
  const dry = tone === "mazesoba"; // 油そば・まぜそばは汁なし＝湯気を控える

  return (
    <svg
      viewBox="0 0 200 150"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {!dry && (
        <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" opacity="0.4">
          <path d="M80 42 C74 33 86 29 80 20" />
          <path d="M100 38 C94 29 106 25 100 16" />
          <path d="M120 42 C114 33 126 29 120 20" />
        </g>
      )}

      <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* 丼の縁 */}
        <ellipse cx="100" cy="72" rx="54" ry="12" fill={ink} fillOpacity="0.07" />
        {/* 丼の本体 */}
        <path d="M50 72 C54 110 74 128 100 128 C126 128 146 110 150 72" />
        {/* 高台 */}
        <path d="M85 132 H115" />
      </g>

      <Topping ink={ink} tone={tone} />

      {/* 箸 */}
      <g stroke={ink} strokeWidth="2.2" strokeLinecap="round" opacity="0.55">
        <path d="M150 38 L100 80" />
        <path d="M158 46 L108 86" />
      </g>
    </svg>
  );
}

function Topping({ ink, tone }: { ink: string; tone: VisualTone }) {
  switch (tone) {
    case "jiro":
      // 野菜の山盛り（マシマシ）
      return (
        <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M58 70 C72 34 128 34 142 70" />
          <path d="M70 62 C84 46 116 46 130 62" opacity="0.6" />
          <path d="M80 54 C92 44 108 44 120 54" opacity="0.45" />
        </g>
      );
    case "iekei":
      // 海苔と味玉
      return (
        <g>
          <rect x="78" y="52" width="6" height="24" rx="1" fill={ink} fillOpacity="0.7" />
          <rect x="87" y="50" width="6" height="26" rx="1" fill={ink} fillOpacity="0.55" />
          <rect x="96" y="52" width="6" height="24" rx="1" fill={ink} fillOpacity="0.4" />
          <Egg ink={ink} cx={122} cy={78} />
        </g>
      );
    case "miso":
      // コーンとバター
      return (
        <g>
          {[88, 98, 108, 118, 93, 103, 113].map((cx, i) => (
            <circle key={i} cx={cx} cy={i < 4 ? 70 : 78} r="2.6" fill={ink} fillOpacity="0.6" />
          ))}
          <rect x="74" y="70" width="9" height="9" rx="1.5" fill="#fff" fillOpacity="0.8" stroke={ink} strokeWidth="1.4" />
        </g>
      );
    case "tsukemen":
      // つけ汁の小鉢を右に添える
      return (
        <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M66 68 C76 60 86 76 96 68" opacity="0.7" />
          <path d="M70 76 C80 68 90 84 100 76" opacity="0.55" />
          <ellipse cx="150" cy="92" rx="20" ry="6" fill={ink} fillOpacity="0.08" />
          <path d="M130 92 C132 104 140 110 150 110 C160 110 168 104 170 92" />
        </g>
      );
    case "mazesoba":
      // 汁なし＝中央に黄身、麺をつまむ
      return (
        <g>
          <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round">
            <path d="M70 74 C82 64 90 80 102 70" opacity="0.7" />
            <path d="M104 73 C114 64 122 80 132 70" opacity="0.6" />
          </g>
          <circle cx="100" cy="76" r="7" fill="#fff" fillOpacity="0.85" stroke={ink} strokeWidth="1.6" />
          <circle cx="100" cy="76" r="3" fill={ink} fillOpacity="0.55" />
        </g>
      );
    case "tanrei":
      // 澄んだスープ＝なるととシンプルな麺
      return (
        <g>
          <g fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.6">
            <path d="M70 72 C82 64 92 78 104 70" />
          </g>
          <circle cx="120" cy="78" r="8" fill="#fff" fillOpacity="0.85" stroke={ink} strokeWidth="1.6" />
          <path d="M120 78 m-4 0 a4 4 0 1 1 4 4" fill="none" stroke={ink} strokeWidth="1.4" opacity="0.7" />
        </g>
      );
    default:
      return <Egg ink={ink} cx={119} cy={78} />;
  }
}

function Egg({ ink, cx, cy }: { ink: string; cx: number; cy: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="11" ry="8.5" fill="#fff" fillOpacity="0.82" stroke={ink} strokeWidth="1.8" />
      <circle cx={cx} cy={cy} r="3.6" fill={ink} fillOpacity="0.5" />
    </g>
  );
}
