"use client";

import { useMemo, useState } from "react";
import type { Shop } from "@/lib/types";
import VisualShopCard from "./VisualShopCard";
import QuickFilterBar, { type QuickFilterItem } from "./QuickFilterBar";

interface QuickCondition extends QuickFilterItem {
  test: (shop: Shop) => boolean;
}

const QUICK_CONDITIONS: QuickCondition[] = [
  { key: "near", label: "近い", test: (s) => s.campusWalkMin <= 10 },
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
      for (const c of activeTests) {
        if (!c.test(shop)) return false;
      }
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
    <div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="店名・駅名・ジャンルで検索"
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-base placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div className="mt-4 flex gap-6 border-b border-border text-sm">
        <Tab active={area === null} label="すべて" onClick={() => setArea(null)} />
        {areas.map((a) => (
          <Tab key={a} active={area === a} label={a} onClick={() => setArea(area === a ? null : a)} />
        ))}
      </div>

      <div className="mt-4">
        <QuickFilterBar items={QUICK_CONDITIONS} isActive={(k) => quick.has(k)} onToggle={toggleQuick} />
      </div>

      <div className="mt-3 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div className="flex gap-1.5 sm:flex-wrap">
          <GenreChip active={genre === null} label="全ジャンル" onClick={() => setGenre(null)} />
          {genres.map((g) => (
            <GenreChip key={g} active={genre === g} label={g} onClick={() => setGenre(genre === g ? null : g)} />
          ))}
        </div>
      </div>

      <p className="mt-5 text-xs text-muted">{filtered.length}件</p>

      {filtered.length === 0 ? (
        <div className="mt-2 rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted">
          条件に合うお店が見つかりませんでした。条件を減らしてみてください。
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((shop, i) => (
            <VisualShopCard key={shop.id} shop={shop} priority={i < 2} />
          ))}
        </div>
      )}
    </div>
  );
}

function Tab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px shrink-0 border-b-2 py-2 transition-colors ${
        active ? "border-accent font-semibold text-foreground" : "border-transparent text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function GenreChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
        active ? "border-accent bg-accent-soft text-accent" : "border-border text-muted hover:border-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
