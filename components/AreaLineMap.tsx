"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { copy } from "@/content/site-copy";

// トップの主役ビジュアル。三田−日吉−横浜が1本の鉄道軸でつながっている事実を
// 縦の沿線図として見せる。駅をタップするとそのエリアの一覧へ飛ぶ。
// エフェクトは「線が一度だけ引かれる」＋駅ドットのフェードのみに抑える。
export default function AreaLineMap({ counts }: { counts: Record<string, number> }) {
  const m = copy.lineMap;

  return (
    <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-muted">{m.label}</p>
        <Link href="/shops" className="text-xs font-medium text-muted transition-colors hover:text-accent">
          {m.viewAll} →
        </Link>
      </div>

      <div className="relative mt-3">
        <motion.span
          aria-hidden
          className="absolute bottom-6 left-[7px] top-6 w-[2px] origin-top bg-foreground"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <ul>
          {m.stations.map((st, i) => (
            <li key={st.id}>
              {i > 0 && (
                <p className="py-0.5 pl-8 text-[11px] leading-tight text-muted/80">{m.segments[i - 1]}</p>
              )}
              <Link
                href={`/shops?area=${encodeURIComponent(st.id)}`}
                className="group relative flex items-center justify-between gap-3 py-3 pl-8"
              >
                <motion.span
                  aria-hidden
                  className="absolute left-0 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border-2 border-foreground bg-card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.15 }}
                >
                  {st.campus && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                </motion.span>
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
                      {st.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-muted">{st.en}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">{st.note}</span>
                </span>
                <span className="flex shrink-0 items-baseline gap-1.5 text-sm font-semibold tabular-nums text-foreground">
                  {m.count(counts[st.id] ?? 0)}
                  <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-[11px] text-muted">
        <span
          aria-hidden
          className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-foreground bg-card"
        >
          <span className="h-1 w-1 rounded-full bg-accent" />
        </span>
        {m.legend}
      </p>
    </div>
  );
}
