import type { PriceConfidence } from "@/lib/types";

// 看板メニューと現実的な一食の価格目安。価格帯を小さく右上に置くのではなく、
// 「何を頼んでいくらか」をカードの主役情報として見せる。
export default function PriceNote({
  name,
  price,
  confidence,
  className = "",
}: {
  name: string;
  price: number;
  confidence: PriceConfidence;
  className?: string;
}) {
  const approx = confidence !== "exact";
  return (
    <p className={`text-sm ${className}`}>
      <span className="font-medium text-foreground">{name}</span>
      <span className="mx-1.5 text-muted">·</span>
      <span className="font-bold text-foreground">¥{price.toLocaleString()}{approx ? "前後" : ""}</span>
      {approx && <span className="ml-1 text-xs text-muted">目安</span>}
    </p>
  );
}
