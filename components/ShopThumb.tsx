import Image from "next/image";

// 写真がある店は写真を表示。ない店は「偽のラーメン写真」や英語の空状態ラベルを出さず、
// 縦書きのジャンル名だけを置いた静かなタイルにする。店ごとに文字が変わるので単調にならない。
export default function ShopThumb({
  genre,
  primaryImageUrl,
  imageAlt,
  className = "",
  sizes,
}: {
  genre: string;
  primaryImageUrl?: string;
  imageAlt?: string;
  className?: string;
  sizes?: string;
}) {
  if (primaryImageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-md bg-border ${className}`}>
        <Image src={primaryImageUrl} alt={imageAlt ?? ""} fill sizes={sizes ?? "120px"} className="object-cover" />
      </div>
    );
  }

  const size = genre.length <= 2 ? "text-[15px]" : genre.length === 3 ? "text-[13px]" : "text-[11px]";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-md border border-border bg-[#efeae2] ${className}`}
      role="img"
      aria-label={genre}
    >
      <span
        aria-hidden
        className={`select-none font-semibold tracking-[0.3em] text-foreground/40 [writing-mode:vertical-rl] ${size}`}
      >
        {genre}
      </span>
    </div>
  );
}
