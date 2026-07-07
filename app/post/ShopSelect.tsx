"use client";

import { useMemo, useState } from "react";
import { copy } from "@/content/site-copy";

export interface ShopOption {
  id: string;
  name: string;
  area: string;
  station: string;
}

const f = copy.post.fields;
const AREA_ORDER = ["日吉", "三田", "横浜"];

// 巨大な <select> の代わりに、検索して選ぶ店舗ピッカー。
// 選択後はコンパクトな表示に畳み、値は hidden input で form に渡す。
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

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shops;
    return shops.filter((s) => [s.name, s.area, s.station].join(" ").toLowerCase().includes(q));
  }, [shops, query]);

  // 検索していない時はエリア見出し付きで全店を見せ、タップだけでも選べるようにする
  const grouped = useMemo(() => {
    if (query.trim()) return [{ area: null as string | null, items: matches }];
    return AREA_ORDER.map((area) => ({
      area: area as string | null,
      items: matches.filter((s) => s.area === area),
    })).filter((g) => g.items.length > 0);
  }, [matches, query]);

  if (selected) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-foreground bg-card px-3.5 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{selected.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {selected.area} · {selected.station}
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
      {matches.length === 0 ? (
        <div className="mt-2 border-y border-border py-3 text-xs leading-relaxed text-muted">
          <p className="font-medium text-foreground">{f.shopEmpty}</p>
          <p className="mt-1">{f.shopEmptyHint}</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-2 font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
          >
            {f.shopReset}
          </button>
        </div>
      ) : (
        <div className="mt-2 max-h-72 overflow-y-auto rounded-md border border-border bg-card">
          {grouped.map((group) => (
            <div key={group.area ?? "search"}>
              {group.area && (
                <p className="sticky top-0 border-b border-border bg-background px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-muted">
                  {group.area}
                </p>
              )}
              <ul className="divide-y divide-border">
                {group.items.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(s.id)}
                      className="flex w-full items-baseline justify-between gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-background"
                    >
                      <span className="min-w-0 truncate text-sm font-medium text-foreground">{s.name}</span>
                      <span className="shrink-0 text-xs text-muted">{s.station}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
