"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { copy } from "@/content/site-copy";

// Area Index の沿線図。三田−日吉−横浜が1本の鉄道軸でつながっている事実を、
// 紙面の罫線と一体化したバンドとして見せる（カード箱には入れない）。
// デスクトップは横組み、モバイルは縦組み。エフェクトは線が一度だけ引かれるのみ。
export default function AreaLineMap({ counts }: { counts: Record<string, number> }) {
  const m = copy.lineMap;

  return (
    <div>
      {/* 横組み（lg以上） */}
      <div className="hidden lg:block">
        <div className="flex items-start">
          {m.stations.map((st, i) => (
            <div key={st.id} className="contents">
              {i > 0 && (
                <div className="flex-1 pt-[9px]">
                  <motion.div
                    className="h-[2px] origin-left bg-foreground"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 + (i - 1) * 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <p className="mt-3 px-3 text-center text-[11px] leading-tight text-muted">{m.segments[i - 1]}</p>
                </div>
              )}
              <Link href={`/shops?area=${encodeURIComponent(st.id)}`} className="group w-52 shrink-0">
                <span
                  aria-hidden
                  className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-foreground bg-background"
                >
                  {st.campus && <span className="h-[7px] w-[7px] rounded-full bg-accent" />}
                </span>
                <span className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {st.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-muted">{st.en}</span>
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">{st.note}</span>
                <span className="mt-2 inline-flex items-baseline gap-1.5 text-sm font-semibold tabular-nums text-foreground">
                  {m.count(counts[st.id] ?? 0)}
                  <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 縦組み（lg未満） */}
      <div className="relative lg:hidden">
        <motion.span
          aria-hidden
          className="absolute bottom-6 left-[9px] top-6 w-[2px] origin-top bg-foreground"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
        <ul>
          {m.stations.map((st, i) => (
            <li key={st.id}>
              {i > 0 && <p className="py-0.5 pl-9 text-[11px] leading-tight text-muted/80">{m.segments[i - 1]}</p>}
              <Link
                href={`/shops?area=${encodeURIComponent(st.id)}`}
                className="group relative flex items-center justify-between gap-3 py-3.5 pl-9"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border-2 border-foreground bg-background"
                >
                  {st.campus && <span className="h-[7px] w-[7px] rounded-full bg-accent" />}
                </span>
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="text-lg font-bold tracking-tight text-foreground">{st.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-muted">{st.en}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">{st.note}</span>
                </span>
                <span className="flex shrink-0 items-baseline gap-1.5 text-sm font-semibold tabular-nums text-foreground">
                  {m.count(counts[st.id] ?? 0)}
                  <span aria-hidden className="text-muted">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 flex items-center gap-2 text-[11px] text-muted">
        <span
          aria-hidden
          className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-foreground bg-background"
        >
          <span className="h-1 w-1 rounded-full bg-accent" />
        </span>
        {m.legend}
      </p>
    </div>
  );
}
