"use client";

export interface QuickFilterItem {
  key: string;
  label: string;
}

export default function QuickFilterBar({
  items,
  isActive,
  onToggle,
}: {
  items: QuickFilterItem[];
  isActive: (key: string) => boolean;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <div className="flex gap-2 sm:flex-wrap">
        {items.map((item) => {
          const active = isActive(item.key);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onToggle(item.key)}
              aria-pressed={active}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-border text-muted hover:border-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
