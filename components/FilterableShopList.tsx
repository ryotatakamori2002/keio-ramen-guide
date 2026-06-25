"use client";

import { useMemo, useState } from "react";
import type { SceneTag, Shop } from "@/lib/types";
import { SCENE_OPTIONS } from "@/lib/quiz";
import ShopCard from "./ShopCard";

interface ToggleFilterKey {
  key: "beginnerOnly" | "soloOnly" | "lowQueueOnly" | "heavyVolumeOnly" | "lateNightOnly";
  label: string;
  test: (shop: Shop) => boolean;
}

const TOGGLE_FILTERS: ToggleFilterKey[] = [
  { key: "beginnerOnly", label: "初心者向け", test: (s) => s.beginnerFriendly >= 4 },
  { key: "soloOnly", label: "一人向け", test: (s) => s.soloFriendly >= 4 },
  { key: "lowQueueOnly", label: "並び少なめ", test: (s) => s.queueLevel <= 2 },
  { key: "heavyVolumeOnly", label: "腹パン", test: (s) => s.volume >= 4 },
  { key: "lateNightOnly", label: "深夜営業", test: (s) => s.lateNight },
];

export default function FilterableShopList({
  shops,
  initialArea = null,
}: {
  shops: Shop[];
  initialArea?: string | null;
}) {
  const [keyword, setKeyword] = useState("");
  const [area, setArea] = useState<string | null>(initialArea);
  const [genre, setGenre] = useState<string | null>(null);
  const [scene, setScene] = useState<SceneTag | null>(null);
  const [toggles, setToggles] = useState<Record<ToggleFilterKey["key"], boolean>>({
    beginnerOnly: false,
    soloOnly: false,
    lowQueueOnly: false,
    heavyVolumeOnly: false,
    lateNightOnly: false,
  });

  const areas = useMemo(() => Array.from(new Set(shops.map((s) => s.area))), [shops]);
  const genres = useMemo(() => Array.from(new Set(shops.flatMap((s) => s.genres))), [shops]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return shops.filter((shop) => {
      if (area && shop.area !== area) return false;
      if (genre && !shop.genres.includes(genre)) return false;
      if (scene && !shop.sceneTags.includes(scene)) return false;
      for (const filter of TOGGLE_FILTERS) {
        if (toggles[filter.key] && !filter.test(shop)) return false;
      }
      if (kw) {
        const haystack = [shop.name, shop.station, shop.area, ...shop.genres, shop.recommendedMenu]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  }, [shops, keyword, area, genre, scene, toggles]);

  function toggle(key: ToggleFilterKey["key"]) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="店名・駅名・ジャンルで検索"
        className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div className="mt-3 flex flex-wrap gap-1.5">
        <FilterChip active={area === null} label="全エリア" onClick={() => setArea(null)} />
        {areas.map((a) => (
          <FilterChip key={a} active={area === a} label={a} onClick={() => setArea(area === a ? null : a)} />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <FilterChip active={genre === null} label="全ジャンル" onClick={() => setGenre(null)} />
        {genres.map((g) => (
          <FilterChip key={g} active={genre === g} label={g} onClick={() => setGenre(genre === g ? null : g)} />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <FilterChip active={scene === null} label="全シーン" onClick={() => setScene(null)} />
        {SCENE_OPTIONS.map((s) => (
          <FilterChip
            key={s.value}
            active={scene === s.value}
            label={s.label}
            onClick={() => setScene(scene === s.value ? null : s.value)}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {TOGGLE_FILTERS.map((f) => (
          <FilterChip key={f.key} active={toggles[f.key]} label={f.label} onClick={() => toggle(f.key)} />
        ))}
      </div>

      <p className="mt-4 text-xs text-muted">{filtered.length}件見つかりました</p>

      <div className="mt-2 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
            条件に合うお店が見つかりませんでした。フィルターを減らしてみてください。
          </div>
        ) : (
          filtered.map((shop) => <ShopCard key={shop.id} shop={shop} />)
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active ? "border-accent bg-accent text-white" : "border-border bg-card text-foreground hover:border-accent"
      }`}
    >
      {label}
    </button>
  );
}
