import type { PriceConfidence } from "@/lib/types";

// 看板メニューと現実的な一食の価格目安を見せる。
// "exact" 以外は「目安」「前後」を明記して、断定しすぎないようにする。
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
      <span className="text-foreground">{name}</span>
      <span className="text-muted">{approx ? " 目安" : ""}：</span>
      <span className="font-semibold text-accent">
        ¥{price.toLocaleString()}
        {approx ? "前後" : ""}
      </span>
    </p>
  );
}
