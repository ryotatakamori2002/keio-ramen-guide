import type { Shop } from "@/lib/types";
import RamenVisual from "./RamenVisual";

// 店舗詳細の上部に置く大きめのビジュアル。
export default function ShopHero({ shop }: { shop: Shop }) {
  return (
    <div>
      <RamenVisual
        tone={shop.visualTone}
        imageUrl={shop.imageUrl}
        imageAlt={shop.imageAlt}
        label={shop.genres[0]}
        priority
        sizes="(max-width: 768px) 100vw, 720px"
        className="aspect-[16/9] w-full rounded-xl sm:aspect-[5/2]"
      />
      {shop.imageCredit && (
        <p className="mt-1.5 text-right text-[11px] text-muted">写真：{shop.imageCredit}</p>
      )}
    </div>
  );
}
