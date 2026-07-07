"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Shop } from "@/lib/types";
import { copy } from "@/content/site-copy";

const emptySubscribe = () => () => {};

// Heroの主役写真。装飾ではなく写真そのものを見せる。
// - スクロールで最大40pxだけ遅れて動く（それ以上は動かさない）
// - 読み込み時に1.05→1.00へゆっくり寄る（1回だけ）
// - 文字は黒グラデの上にだけ載せる。写真の色は殺さない
// - reduced-motion では完全に静止
export default function HeroPhoto({ shop }: { shop: Shop }) {
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 40]);
  const active = mounted && !reduce;

  if (!shop.heroImageUrl) return null;

  return (
    <div className="relative h-[46vh] min-h-[340px] w-full overflow-hidden lg:h-full lg:min-h-[560px]">
      {/* parallax分だけ上下に余白を持たせてブリード */}
      <motion.div style={active ? { y } : undefined} className="absolute inset-x-0 -bottom-12 -top-12">
        <motion.div
          className="relative h-full w-full"
          initial={active ? { scale: 1.05 } : false}
          animate={active ? { scale: 1 } : undefined}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={shop.heroImageUrl}
            alt={shop.imageAlt ?? shop.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-[30%_55%]"
          />
        </motion.div>
      </motion.div>

      {/* 左パネルとの継ぎ目（lgのみ）と、キャプション用の下グラデ */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-[#11100e] to-transparent lg:block"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#11100e]/90 via-[#11100e]/30 to-transparent"
      />

      {/* 今日の一杯キャプション */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9">
        <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-[#cfc6b8]">
          <span aria-hidden className="h-2 w-2 bg-[#c53024]" />
          {copy.featured.label}
        </p>
        <div className="mt-2.5 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <p className="text-xl font-bold tracking-tight text-[#f7f1e8] sm:text-2xl">{shop.name}</p>
            <p className="mt-1.5 text-xs text-[#cfc6b8] sm:text-sm">
              {shop.genres[0]} · {shop.firstVisitOrder} ¥{shop.firstVisitPrice.toLocaleString()}
              <span className="opacity-70">前後</span>
            </p>
          </div>
          <Link
            href={`/shops/${shop.id}`}
            className="inline-flex shrink-0 items-center rounded-md border border-[#f7f1e8]/60 bg-[#11100e]/30 px-4 py-2 text-sm font-medium text-[#f7f1e8] backdrop-blur-sm transition-colors hover:bg-[#f7f1e8] hover:text-[#11100e]"
          >
            {copy.featured.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
