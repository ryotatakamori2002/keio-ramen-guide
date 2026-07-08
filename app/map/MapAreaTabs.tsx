"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { copy } from "@/content/site-copy";

export interface MapShop {
  id: string;
  name: string;
  station: string;
  genres: string[];
  photo?: string;
  mapsUrl: string;
  order: string;
  price: number;
}

interface AreaTab {
  id: string;
  name: string;
  note: string;
  shops: MapShop[];
}

// エリアタブ＋店舗リスト。各行にGoogle Mapsへの導線を必ず置く。
export default function MapAreaTabs({ tabs }: { tabs: AreaTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  if (!active) return <p className="text-sm text-muted">{copy.map.empty}</p>;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            aria-pressed={tab.id === active.id}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              tab.id === active.id
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {tab.name}
            <span className={`ml-1.5 text-xs ${tab.id === active.id ? "opacity-70" : "text-muted"}`}>
              {tab.shops.length}
            </span>
          </button>
        ))}
      </div>
      {active.note && <p className="mt-2.5 text-xs text-muted">{active.note}</p>}

      <ul className="mt-4 divide-y divide-border border-y border-border">
        {active.shops.map((shop) => (
          <li key={shop.id} className="flex items-center gap-3.5 py-3">
            <Link href={`/shops/${shop.id}`} className="group flex min-w-0 flex-1 items-center gap-3.5">
              {shop.photo ? (
                <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-sm">
                  <Image src={shop.photo} alt="" fill sizes="80px" className="object-cover" />
                </span>
              ) : (
                <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-sm border border-border bg-[var(--thumb-bg)] px-1 text-center text-[10px] leading-tight text-foreground/50">
                  {shop.genres[0]}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                  {shop.name}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted">
                  {shop.station} · {shop.genres.join("/")} · {shop.order} ¥{shop.price.toLocaleString()}
                  <span className="opacity-70">前後</span>
                </span>
              </span>
            </Link>
            <a
              href={shop.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground"
            >
              {copy.map.openMap}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
