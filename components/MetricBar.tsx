import type { Level } from "@/lib/types";

export default function MetricBar({
  level,
  label,
  compact = false,
}: {
  level: Level;
  label: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${compact ? "text-xs" : "text-sm"}`}>
      <span className={`${compact ? "w-12" : "w-24"} shrink-0 text-muted`}>{label}</span>
      <span className="h-1 flex-1 rounded-full bg-border" aria-hidden>
        <span className="block h-1 rounded-full bg-accent" style={{ width: `${(level / 5) * 100}%` }} />
      </span>
      <span aria-label={`${label} ${level}/5`} className="w-3 shrink-0 text-right text-xs text-muted">
        {level}
      </span>
    </div>
  );
}
