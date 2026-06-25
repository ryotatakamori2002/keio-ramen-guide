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
  initialGenre = null,
  initialScene = null,
  initialBeginnerOnly = false,
}: {
  shops: Shop[];
  initialArea?: string | null;
  initialGenre?: string | null;
  initialScene?: SceneTag | null;
  initialBeginnerOnly?: boolean;
}) {
  const [keyword, setKeyword] = useState("");
  const [area, setArea] = useState<string | null>(initialArea);
  const [genre, setGenre] = useState<string | null>(initialGenre);
  const [scene, setScene] = useState<SceneTag | null>(initialScene);
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(initialGenre || initialScene || initialBeginnerOnly),
  );
  const [toggles, setToggles] = useState<Record<ToggleFilterKey["key"], boolean>>({
    beginnerOnly: initialBeginnerOnly,
    soloOnly: false,
    lowQueueOnly: false,
    heavyVolumeOnly: false,
    lateNightOnly: false,
  });

  const areas = useMemo(() => Array.from(new Set(shops.map((s) => s.area))), [shops]);
  const genres = useMemo(() => Array.from(new Set(shops.flatMap((s) => s.genres))), [shops]);

  const activeAdvancedCount =
    (genre ? 1 : 0) + (scene ? 1 : 0) + Object.values(toggles).filter(Boolean).length;

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
        className="w-full border-b border-border bg-transparent py-2.5 text-base placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div className="mt-4 flex gap-6 border-b border-border text-sm">
        <TabButton active={area === null} label="すべて" onClick={() => setArea(null)} />
        {areas.map((a) => (
          <TabButton key={a} active={area === a} label={a} onClick={() => setArea(area === a ? null : a)} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="mt-4 text-sm text-muted underline decoration-border underline-offset-4 hover:text-foreground"
      >
        絞り込む{activeAdvancedCount > 0 ? `（${activeAdvancedCount}）` : ""} {showAdvanced ? "▲" : "▼"}
      </button>

      {showAdvanced && (
        <div className="mt-3 flex flex-col gap-3 border-l border-border pl-4">
          <FilterRow label="ジャンル">
            <Chip active={genre === null} label="すべて" onClick={() => setGenre(null)} />
            {genres.map((g) => (
              <Chip key={g} active={genre === g} label={g} onClick={() => setGenre(genre === g ? null : g)} />
            ))}
          </FilterRow>
          <FilterRow label="シーン">
            <Chip active={scene === null} label="すべて" onClick={() => setScene(null)} />
            {SCENE_OPTIONS.map((s) => (
              <Chip
                key={s.value}
                active={scene === s.value}
                label={s.label}
                onClick={() => setScene(scene === s.value ? null : s.value)}
              />
            ))}
          </FilterRow>
          <FilterRow label="条件">
            {TOGGLE_FILTERS.map((f) => (
              <Chip key={f.key} active={toggles[f.key]} label={f.label} onClick={() => toggle(f.key)} />
            ))}
          </FilterRow>
        </div>
      )}

      <p className="mt-5 text-xs text-muted">{filtered.length}件</p>

      <div>
        {filtered.length === 0 ? (
          <div className="border-t border-border py-10 text-center text-sm text-muted">
            条件に合うお店が見つかりませんでした。絞り込みを減らしてみてください。
          </div>
        ) : (
          filtered.map((shop) => <ShopCard key={shop.id} shop={shop} />)
        )}
      </div>
    </div>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 py-2 transition-colors ${
        active ? "border-accent font-semibold text-foreground" : "border-transparent text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="mr-1 w-12 shrink-0 text-muted">{label}</span>
      {children}
    </div>
  );
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 transition-colors ${
        active ? "border-accent bg-accent-soft text-accent" : "border-border text-muted hover:border-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
