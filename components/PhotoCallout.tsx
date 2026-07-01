import Link from "next/link";
import { copy } from "@/content/site-copy";
import { button, type as t } from "@/lib/design";

// 写真提供の導線。押し付けず、静かに。フォームは作らず /post（＝ログ投稿）へ誘導する。
export default function PhotoCallout() {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <p className={t.eyebrow}>Contribute</p>
      <h2 className="mt-1.5 text-base font-bold tracking-tight text-foreground">{copy.sections.logs.title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{copy.about}</p>
      <Link href="/post" className={`${button.link} mt-3 inline-block`}>
        {copy.hero.secondaryCta} →
      </Link>
    </section>
  );
}
