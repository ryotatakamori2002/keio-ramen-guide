"use client";

import { useSavedShops } from "@/hooks/useSavedShops";

export default function SaveButtons({ shopId, size = "md" }: { shopId: string; size?: "sm" | "md" }) {
  const { isWant, isVisited, toggleWant, toggleGone } = useSavedShops();

  const want = isWant(shopId);
  const visited = isVisited(shopId);
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={`flex items-center gap-4 ${textSize}`}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleWant(shopId);
        }}
        aria-pressed={want}
        className={`border-b transition-colors ${
          want ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground"
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
        className={`border-b transition-colors ${
          visited ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground"
        }`}
      >
        {visited ? "✓ 行った" : "行った"}
      </button>
    </div>
  );
}
