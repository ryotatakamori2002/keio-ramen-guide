"use client";

import { useSavedShops } from "@/hooks/useSavedShops";
import { copy } from "@/content/site-copy";

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
        className={`rounded-full border font-medium transition-colors ${pad} ${
          want
            ? "border-foreground bg-foreground text-background"
            : "border-border text-muted hover:border-foreground hover:text-foreground"
        }`}
      >
        {want ? `✓ ${copy.saved.want}` : copy.saved.want}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleGone(shopId);
        }}
        aria-pressed={visited}
        className={`rounded-full border font-medium transition-colors ${pad} ${
          visited
            ? "border-foreground bg-foreground text-background"
            : "border-border text-muted hover:border-foreground hover:text-foreground"
        }`}
      >
        {visited ? `✓ ${copy.saved.visited}` : copy.saved.visited}
      </button>
    </div>
  );
}
