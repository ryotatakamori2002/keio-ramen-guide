import type { Level } from "@/lib/types";

export default function LevelDots({ level, label }: { level: Level; label: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <span aria-label={`${label} ${level}/5`} className="flex shrink-0 gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i <= level ? "bg-accent" : "bg-border"}`}
          />
        ))}
      </span>
    </div>
  );
}
