"use client";

import { useMemo, useState } from "react";
import type { PostMeta, Shop } from "@/lib/types";
import type { ResolvedShelf } from "@/lib/shelves";
import ShopCard from "./ShopCard";
import ShelfRow from "./ShelfRow";

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
  shelves = [],
  postMeta = {},
}: {
  shops: Shop[];
  initialArea?: string | null;
  initialGenre?: string | null;
  initialQuick?: string[];
  /** 絞り込みが無い時だけ上部に出す用途別ベスト棚（解決済みのシリアライズ可能な形） */
  shelves?: ResolvedShelf[];
  /** 店ごとの投稿サマリ（shopId -> 件数・最新写真） */
  postMeta?: Record<string, PostMeta>;
}) {
  const [keyword, setKeyword] = useState("");
  const [area, setArea] = useState<string | null>(initialArea);
  const [genre, setGenre] = useState<string | null>(initialGenre);
  const [quick, setQuick] = useState<Set<string>>(new Set(initialQuick));
  const [includeCandidates, setIncludeCandidates] = useState(false);

  const areas = useMemo(() => Array.from(new Set(shops.map((s) => s.area))), [shops]);
  // ジャンル選択肢は調査候補を除いた初期表示対象から作る
  const genres = useMemo(
    () => Array.from(new Set(shops.filter((s) => s.publishStatus !== "candidate").flatMap((s) => s.genres))),
    [shops],
  );

  const candidateCount = useMemo(
    () => shops.filter((s) => s.publishStatus === "candidate").length,
    [shops],
  );

  const hasActiveFilter = Boolean(area || genre || quick.size || keyword.trim());

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const activeTests = QUICK_CONDITIONS.filter((c) => quick.has(c.key));
    return shops.filter((shop) => {
      // 調査候補（candidate）はトグルONの時だけ表示
      if (shop.publishStatus === "candidate" && !includeCandidates) return false;
      if (area && shop.area !== area) return false;
      if (genre && !shop.genres.includes(genre)) return false;
      for (const c of activeTests) if (!c.test(shop)) return false;
      if (kw) {
        const haystack = [shop.name, shop.station, shop.area, ...shop.genres, shop.firstVisitOrder]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  }, [shops, keyword, area, genre, quick, includeCandidates]);

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
      {shelves.length > 0 && !hasActiveFilter && (
        <div className="mb-9 flex flex-col gap-9 border-b border-border pb-9">
          {shelves.map((shelf) => (
            <ShelfRow key={shelf.id} shelf={shelf} />
          ))}
        </div>
      )}

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

        {candidateCount > 0 && (
          <label className="mt-5 flex cursor-pointer items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={includeCandidates}
              onChange={(e) => setIncludeCandidates(e.target.checked)}
              className="h-3.5 w-3.5 accent-accent"
            />
            調査候補も含める（{candidateCount}件・未確認）
          </label>
        )}
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
                <ShopCard key={shop.id} shop={shop} postMeta={postMeta[shop.id]} />
              ))}
            </div>
          )}
        </div>
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
