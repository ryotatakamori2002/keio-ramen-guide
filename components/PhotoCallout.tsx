import Link from "next/link";
import { copy } from "@/content/site-copy";
import { button, type as t } from "@/lib/design";

// 投稿導線。押し付けず、静かに /post へ誘導する。
export default function PhotoCallout() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <p className={t.eyebrow}>{copy.recentLogs.label}</p>
      <h2 className="mt-1.5 text-base font-bold tracking-tight text-foreground">{copy.recentLogs.title}</h2>
      <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted">{copy.about.body}</p>
      <Link href="/post" className={`${button.link} mt-3 inline-block`}>
        {copy.recentLogs.viewAll} →
      </Link>
    </section>
  );
}
