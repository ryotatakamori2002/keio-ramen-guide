import type { Level } from "@/lib/types";

export default function StatBar({ level, label }: { level: Level; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 shrink-0 text-muted">{label}</span>
      <span className="h-1 flex-1 rounded-full bg-border" aria-hidden>
        <span
          className="block h-1 rounded-full bg-accent"
          style={{ width: `${(level / 5) * 100}%` }}
        />
      </span>
      <span aria-label={`${label} ${level}/5`} className="w-4 shrink-0 text-right text-xs text-muted">
        {level}
      </span>
    </div>
  );
}
