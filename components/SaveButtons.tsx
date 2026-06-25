"use client";

import { useSavedShops } from "@/hooks/useSavedShops";

export default function SaveButtons({ shopId, size = "md" }: { shopId: string; size?: "sm" | "md" }) {
  const { isWant, isVisited, toggleWant, toggleGone } = useSavedShops();

  const want = isWant(shopId);
  const visited = isVisited(shopId);
  const padding = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleWant(shopId);
        }}
        aria-pressed={want}
        className={`flex-1 rounded-full border font-medium transition-colors ${padding} ${
          want
            ? "border-accent bg-accent text-white"
            : "border-border bg-card text-foreground hover:border-accent hover:text-accent"
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
        className={`flex-1 rounded-full border font-medium transition-colors ${padding} ${
          visited
            ? "border-accent-dark bg-accent-soft text-accent-dark"
            : "border-border bg-card text-foreground hover:border-accent hover:text-accent"
        }`}
      >
        {visited ? "✓ 行った" : "行った"}
      </button>
    </div>
  );
}
