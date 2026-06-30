import type { Metadata } from "next";
import { SHOPS } from "@/lib/shops";
import { isSupabaseReady } from "@/lib/supabase";
import PostForm from "./PostForm";

export const metadata: Metadata = {
  title: "食べた一杯を投稿する | Keio Ramen Guide",
};

export default async function PostPage({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>;
}) {
  const { shop } = await searchParams;
  const ready = isSupabaseReady();

  // フォームに渡すのは選択に必要な最小限（id/name/area）だけ。
  const shopOptions = SHOPS.filter((s) => s.publishStatus !== "candidate")
    .map((s) => ({ id: s.id, name: s.name, area: s.area }))
    .sort((a, b) => a.area.localeCompare(b.area, "ja"));

  const initialShopId = shop && SHOPS.some((s) => s.id === shop) ? shop : "";

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs font-semibold tracking-widest text-accent">実食ログ</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">食べた一杯を投稿する</h1>
      <p className="mt-2 text-sm text-muted">
        価格も、量も、雰囲気も。食べた人の一言でわかる。投稿は確認後に掲載されます。
      </p>

      {!ready ? (
        <div className="mt-6 rounded-lg border border-border bg-card p-5 text-sm text-muted">
          <p className="font-medium text-foreground">投稿機能は準備中です</p>
          <p className="mt-2">
            Supabase設定後に投稿機能が有効になります。セットアップ手順は README を参照してください。
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <PostForm shops={shopOptions} initialShopId={initialShopId} />
        </div>
      )}
    </div>
  );
}
