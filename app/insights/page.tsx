import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { copy } from "@/content/site-copy";
import { button, type as t } from "@/lib/design";

export const metadata: Metadata = {
  title: `${copy.insights.title} | ${copy.serviceName}`,
};

export const revalidate = 300;

// 慶應特化の属性データページ。
// 数字は捏造しない：いま実数で出せるのは投稿数だけなので、それ以外は「公開予定」と明記する。
// 投稿フォームの任意属性（所属・キャンパス・学部・MBTIなど）が貯まったら、ここで実数を公開する。
async function getApprovedPostCount(): Promise<number | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { count, error } = await db
    .from("ramen_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");
  if (error) return null;
  return count ?? 0;
}

export default async function InsightsPage() {
  const postCount = await getApprovedPostCount();

  return (
    <div className="mx-auto max-w-2xl py-2">
      <p className={t.eyebrow}>{copy.insights.eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{copy.insights.title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">{copy.insights.subtitle}</p>

      {postCount !== null && (
        <p className="mt-6 border-y-2 border-foreground py-4 text-sm font-semibold text-foreground">
          {copy.insights.postsSoFar(postCount)}
        </p>
      )}

      <h2 className="mt-10 text-sm font-semibold tracking-[0.08em] text-muted">{copy.insights.plannedLabel}</h2>
      <div className="mt-3 border-t border-border">
        {copy.insights.planned.map((item) => (
          <article key={item.title} className="border-b border-border py-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold tracking-tight text-foreground">{item.title}</h3>
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
                投稿が集まり次第、公開
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/post" className={button.primary}>
          {copy.insights.cta}
        </Link>
        <p className="mt-3 text-xs text-muted">{copy.insights.note}</p>
      </div>
    </div>
  );
}
