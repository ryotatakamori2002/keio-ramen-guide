import type { Shop } from "@/lib/types";

// 近さ/並び/一人/量 を数値で横並びにし、店どうしを比較しやすくする。
export default function MetricStrip({ shop }: { shop: Shop }) {
  const items: { label: string; value: number }[] = [
    { label: "近さ", value: shop.nearness },
    { label: "並び", value: shop.queueLevel },
    { label: "一人", value: shop.soloFriendly },
    { label: "量", value: shop.volume },
  ];
  return (
    <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-1">
          <dt>{item.label}</dt>
          <dd className="font-semibold text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
