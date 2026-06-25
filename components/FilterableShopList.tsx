"use client";

import { useMemo, useState } from "react";
import type { Shop } from "@/lib/types";
import ShopCard from "./ShopCard";

interface QuickCondition {
  key: string;
  label: string;
  test: (shop: Shop) => boolean;
}

const QUICK_CONDITIONS: QuickCondition[] = [
  { key: "near", label: "近い", test: (s) => s.nearness >= 4 },
  { key: "solo", label: "一人で入りやすい", test: (s) => s.soloFriendly >= 4 },
  { key: "lowQueue", label: "並び少なめ", test: (s) => s.queueLevel <= 2 },
  { key: "hearty", label: "腹パン", test: (s) => s.volume >= 4 },
  { key: "beginner", label: "初心者向け", test: (s) => s.beginnerFriendly >= 4 },
  { key: "drinking", label: "飲み後", test: (s) => s.sceneTags.includes("after_drinking") },
];

export default function FilterableShopList({
  shops,
  initialArea = null,
  initialGenre = null,
  initialQuick = [],
}: {
  shops: Shop[];
  initialArea?: string | null;
  initialGenre?: string | null;
  initialQuick?: string[];
}) {
  const [keyword, setKeyword] = useState("");
  const [area, setArea] = useState<string | null>(initialArea);
  const [genre, setGenre] = useState<string | null>(initialGenre);
  const [quick, setQuick] = useState<Set<string>>(new Set(initialQuick));

  const areas = useMemo(() => Array.from(new Set(shops.map((s) => s.area))), [shops]);
  const genres = useMemo(() => Array.from(new Set(shops.flatMap((s) => s.genres))), [shops]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const activeTests = QUICK_CONDITIONS.filter((c) => quick.has(c.key));
    return shops.filter((shop) => {
      if (area && shop.area !== area) return false;
      if (genre && !shop.genres.includes(genre)) return false;
      for (const c of activeTests) if (!c.test(shop)) return false;
      if (kw) {
        const haystack = [shop.name, shop.station, shop.area, ...shop.genres, shop.signatureOrderName]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  }, [shops, keyword, area, genre, quick]);

  function toggleQuick(key: string) {
    setQuick((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="lg:grid lg:grid-cols-[230px_1fr] lg:gap-8">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="店名・駅・ジャンルで検索"
          className="w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />

        <FilterGroup label="エリア">
          <Chip active={area === null} label="すべて" onClick={() => setArea(null)} />
          {areas.map((a) => (
            <Chip key={a} active={area === a} label={a} onClick={() => setArea(area === a ? null : a)} />
          ))}
        </FilterGroup>

        <FilterGroup label="条件">
          {QUICK_CONDITIONS.map((c) => (
            <Chip key={c.key} active={quick.has(c.key)} label={c.label} onClick={() => toggleQuick(c.key)} />
          ))}
        </FilterGroup>

        <FilterGroup label="ジャンル">
          <Chip active={genre === null} label="すべて" onClick={() => setGenre(null)} />
          {genres.map((g) => (
            <Chip key={g} active={genre === g} label={g} onClick={() => setGenre(genre === g ? null : g)} />
          ))}
        </FilterGroup>
      </aside>

      <div className="mt-6 lg:mt-0">
        <p className="mb-3 text-xs text-muted">{filtered.length}件</p>
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted">
            条件に合うお店が見つかりませんでした。条件を減らしてみてください。
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-1.5 text-xs font-semibold text-muted">{label}</p>
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible">
        {children}
      </div>
    </div>
  );
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-accent bg-accent text-white"
          : "border-border text-foreground hover:border-foreground"
      }`}
    >
      {label}
    </button>
  );
}
