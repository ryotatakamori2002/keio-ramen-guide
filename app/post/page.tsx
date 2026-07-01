import type { Metadata } from "next";
import { SHOPS } from "@/lib/shops";
import { isSupabaseReady } from "@/lib/supabase";
import { copy } from "@/content/site-copy";
import { type as t } from "@/lib/design";
import PostForm from "./PostForm";

export const metadata: Metadata = {
  title: `${copy.post.eyebrow} | ${copy.serviceName}`,
};

export default async function PostPage({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>;
}) {
  const { shop } = await searchParams;
  const ready = isSupabaseReady();

  const shopOptions = SHOPS.filter((s) => s.publishStatus !== "candidate")
    .map((s) => ({ id: s.id, name: s.name, area: s.area }))
    .sort((a, b) => a.area.localeCompare(b.area, "ja"));

  const initialShopId = shop && SHOPS.some((s) => s.id === shop) ? shop : "";

  return (
    <div className="mx-auto max-w-xl py-2">
      <p className={t.eyebrow}>{copy.post.eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{copy.post.title}</h1>
      <p className="mt-2 text-sm text-muted">{copy.post.subtitle}</p>

      {!ready ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-sm text-muted">
          <p className="font-medium text-foreground">{copy.post.disabledTitle}</p>
          <p className="mt-2 leading-relaxed">{copy.post.disabledBody}</p>
        </div>
      ) : (
        <div className="mt-8">
          <PostForm shops={shopOptions} initialShopId={initialShopId} />
        </div>
      )}
    </div>
  );
}
