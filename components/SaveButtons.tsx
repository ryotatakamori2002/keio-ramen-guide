"use client";

import { useSavedShops } from "@/hooks/useSavedShops";

export default function SaveButtons({ shopId, size = "sm" }: { shopId: string; size?: "sm" | "md" }) {
  const { isWant, isVisited, toggleWant, toggleGone } = useSavedShops();

  const want = isWant(shopId);
  const visited = isVisited(shopId);
  const pad = size === "md" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleWant(shopId);
        }}
        aria-pressed={want}
        className={`rounded-md border font-medium transition-colors ${pad} ${
          want
            ? "border-accent bg-accent text-white"
            : "border-border text-foreground hover:border-accent hover:text-accent"
        }`}
      >
        {want ? "✓ 行きたい" : "行きたい"}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleGone(shopId);
        }}
        aria-pressed={visited}
        className={`rounded-md border font-medium transition-colors ${pad} ${
          visited
            ? "border-foreground bg-foreground text-white"
            : "border-border text-muted hover:border-foreground hover:text-foreground"
        }`}
      >
        {visited ? "✓ 行った" : "行った"}
      </button>
    </div>
  );
}
