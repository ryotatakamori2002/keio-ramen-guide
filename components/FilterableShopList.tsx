"use client";

import { useMemo, useState } from "react";
import type { PostMeta, Shop } from "@/lib/types";
import { copy } from "@/content/site-copy";
import ShopCard from "./ShopCard";
import FadeIn from "./motion/FadeIn";
import Stagger from "./motion/Stagger";

interface QuickCondition {
  key: string;
  label: string;
  test: (shop: Shop) => boolean;
}

const QUICK_CONDITIONS: QuickCondition[] = [
  { key: "near", label: "駅近", test: (s) => s.nearness >= 4 },
  { key: "solo", label: "一人向き", test: (s) => s.soloFriendly >= 4 },
  { key: "lowQueue", label: "並び少なめ", test: (s) => s.queueLevel <= 2 },
  { key: "hearty", label: "量多め", test: (s) => s.volume >= 4 },
  { key: "beginner", label: "初心者向き", test: (s) => s.beginnerFriendly >= 4 },
  { key: "drinking", label: "深夜・飲み後", test: (s) => s.sceneTags.includes("after_drinking") },
];

import { LIVE_AREA_ORDER } from "@/lib/areas";

export default function FilterableShopList({
  shops,
  initialArea = null,
  initialGenre = null,
  initialQuick = [],
  postMeta = {},
}: {
  shops: Shop[];
  initialArea?: string | null;
  initialGenre?: string | null;
  initialQuick?: string[];
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

  // 絞り込みが無い時はエリアごとに見出しを付けて、単調な縦積みに構造を与える
  const groupedByArea = useMemo(() => {
    const groups = new Map<string, Shop[]>();
    for (const shop of filtered) {
      const list = groups.get(shop.area) ?? [];
      list.push(shop);
      groups.set(shop.area, list);
    }
    // 掲載中エリアの順で並べ、台帳にない新エリア（DB追加）は後ろに続ける
    const known = LIVE_AREA_ORDER.filter((a) => groups.has(a));
    const extra = Array.from(groups.keys()).filter((a) => !LIVE_AREA_ORDER.includes(a));
    return [...known, ...extra].map((a) => ({ area: a, shops: groups.get(a)! }));
  }, [filtered]);

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
          placeholder={copy.shops.searchPlaceholder}
          className="w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
        />

        <FilterGroup label={copy.shops.filterArea}>
          <Chip active={area === null} label="すべて" onClick={() => setArea(null)} />
          {areas.map((a) => (
            <Chip key={a} active={area === a} label={a} onClick={() => setArea(area === a ? null : a)} />
          ))}
        </FilterGroup>

        <FilterGroup label={copy.shops.filterMood}>
          {QUICK_CONDITIONS.map((c) => (
            <Chip key={c.key} active={quick.has(c.key)} label={c.label} onClick={() => toggleQuick(c.key)} />
          ))}
        </FilterGroup>

        <FilterGroup label={copy.shops.filterGenre}>
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
              className="h-3.5 w-3.5 accent-foreground"
            />
            {copy.shops.includeCandidates}（{candidateCount}）
          </label>
        )}
      </aside>

      <div className="mt-8 lg:mt-0">
        {filtered.length === 0 ? (
          <div className="border-y border-border py-12 text-center text-sm text-muted">{copy.shops.empty}</div>
        ) : hasActiveFilter ? (
          <>
            <p className="mb-3 text-xs tracking-[0.14em] text-muted">{copy.shops.count(filtered.length)}</p>
            <Stagger className="flex flex-col border-b border-border" gap={0.05}>
              {filtered.map((shop) => (
                <ShopCard key={shop.id} shop={shop} postMeta={postMeta[shop.id]} />
              ))}
            </Stagger>
          </>
        ) : (
          <div className="flex flex-col gap-12">
            {groupedByArea.map(({ area: a, shops: group }) => (
              <section key={a}>
                <FadeIn y={8}>
                  <div className="flex items-baseline gap-2.5 border-b-2 border-foreground pb-2">
                    <h2 className="text-lg font-bold tracking-tight text-foreground">{a}</h2>
                    <span className="text-xs text-muted">{copy.shops.count(group.length)}</span>
                  </div>
                </FadeIn>
                {/* 見出しの太罫線が上端の役をするので、先頭行の細罫線だけ消す */}
                <Stagger
                  className="flex flex-col border-b border-border [&>div:first-child_article]:border-t-0"
                  gap={0.05}
                >
                  {group.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} postMeta={postMeta[shop.id]} />
                  ))}
                </Stagger>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-muted">{label}</p>
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
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted hover:border-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
