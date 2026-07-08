"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { copy } from "@/content/site-copy";

export interface ShopOption {
  id: string;
  name: string;
  area: string;
  station: string;
  genres: string[];
  photo?: string;
}

const f = copy.post.fields;

// 空欄のときに出す代表店（大量リストは出さない）
const DEFAULT_SUGGEST_IDS = ["mita-jiro", "yokohama-ishinshoten", "hiyoshi-musashiya"];
const MAX_SUGGESTIONS = 6;

// 検索用の正規化: 小文字化＋全角/半角スペース除去
function normalize(text: string): string {
  return text.toLowerCase().replace(/[\s　]+/g, "");
}

// 店名・エリア・駅・ジャンルでサジェストする店舗検索。
// 巨大なリストは出さず、入力に応じて最大6件だけ提案する。
// 値は hidden input (shopId) で既存のServer Actionへそのまま渡す。
export default function ShopSelect({
  shops,
  initialShopId,
}: {
  shops: ShopOption[];
  initialShopId: string;
}) {
  const [selectedId, setSelectedId] = useState(initialShopId);
  const [query, setQuery] = useState("");

  const selected = shops.find((s) => s.id === selectedId) ?? null;

  const suggestions = useMemo(() => {
    const q = normalize(query);
    if (!q) {
      return DEFAULT_SUGGEST_IDS.map((id) => shops.find((s) => s.id === id)).filter(
        (s): s is ShopOption => Boolean(s),
      );
    }
    return shops
      .filter((s) => normalize([s.name, s.area, s.station, ...s.genres].join(" ")).includes(q))
      .slice(0, MAX_SUGGESTIONS);
  }, [shops, query]);

  if (selected) {
    return (
      <div className="flex items-center gap-3.5 rounded-md border border-foreground bg-card p-3">
        <SuggestThumb shop={selected} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-foreground">{selected.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {selected.station} · {selected.genres.join("/")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedId("");
            setQuery("");
          }}
          className="shrink-0 text-xs font-medium text-muted underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {f.shopChange}
        </button>
        <input type="hidden" name="shopId" value={selected.id} />
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={f.shopSearchPlaceholder}
        autoComplete="off"
        className="w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
      />

      {suggestions.length === 0 ? (
        <p className="mt-2.5 border-y border-border py-3 text-xs leading-relaxed text-muted">{f.shopEmpty}</p>
      ) : (
        <motion.div
          key={query ? "search" : "default"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2.5"
        >
          {!query && <p className="mb-1.5 text-[11px] tracking-[0.08em] text-muted">{f.shopDefaultLabel}</p>}
          <ul className="divide-y divide-border border-y border-border">
            {suggestions.map((shop) => (
              <li key={shop.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(shop.id)}
                  className="flex w-full items-center gap-3 px-1 py-2.5 text-left transition-colors hover:bg-card"
                >
                  <SuggestThumb shop={shop} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">{shop.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {shop.area} · {shop.station} · {shop.genres.join("/")}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}

// 候補行・選択中カードのサムネ。写真がある店は写真、ない店は控えめなジャンルタイル。
function SuggestThumb({ shop, size = "md" }: { shop: ShopOption; size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-14 w-[74px]" : "h-10 w-14";
  if (shop.photo) {
    return (
      <span className={`relative block shrink-0 overflow-hidden rounded-sm ${box}`}>
        <Image src={shop.photo} alt="" fill sizes="74px" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-sm border border-border bg-[var(--thumb-bg)] px-1 text-center text-[10px] leading-tight text-foreground/50 ${box}`}
    >
      {shop.genres[0]}
    </span>
  );
}
