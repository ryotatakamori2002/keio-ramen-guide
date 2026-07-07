import Image from "next/image";

// 写真がある店は写真を表示。ない店は「偽のラーメン写真」や英語の空状態ラベルを出さず、
// 縦書きのジャンル名だけを置いた静かなタイルにする。店ごとに文字が変わるので単調にならない。
// - 地色はテーマ変数（--thumb-bg）。ダークセクションでも成立する
// - size="lg" はポスター枠用の大きめタイポ
// - frame=false で枠と角丸を外す（外側がポスター枠を持つ場合）
export default function ShopThumb({
  genre,
  primaryImageUrl,
  imageAlt,
  className = "",
  sizes,
  size = "md",
  frame = true,
}: {
  genre: string;
  primaryImageUrl?: string;
  imageAlt?: string;
  className?: string;
  sizes?: string;
  size?: "md" | "lg";
  frame?: boolean;
}) {
  const frameClass = frame ? "rounded-md border border-border" : "";

  if (primaryImageUrl) {
    return (
      <div className={`relative overflow-hidden bg-border ${frameClass} ${className}`}>
        <Image
          src={primaryImageUrl}
          alt={imageAlt ?? ""}
          fill
          sizes={sizes ?? "120px"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  const text =
    size === "lg"
      ? genre.length <= 2
        ? "text-4xl tracking-[0.4em]"
        : genre.length === 3
          ? "text-3xl tracking-[0.35em]"
          : "text-2xl tracking-[0.3em]"
      : genre.length <= 2
        ? "text-[15px] tracking-[0.3em]"
        : genre.length === 3
          ? "text-[13px] tracking-[0.3em]"
          : "text-[11px] tracking-[0.3em]";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[var(--thumb-bg)] ${frameClass} ${className}`}
      role="img"
      aria-label={genre}
    >
      <span
        aria-hidden
        className={`select-none font-semibold text-foreground/40 transition-transform duration-300 [writing-mode:vertical-rl] group-hover:-translate-y-0.5 ${text}`}
      >
        {genre}
      </span>
    </div>
  );
}
