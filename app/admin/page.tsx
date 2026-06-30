import type { Metadata } from "next";
import Image from "next/image";
import { getShopById } from "@/lib/shops";
import { getPendingPosts } from "@/lib/posts";
import { isSupabaseReady } from "@/lib/supabase";
import { SCENE_LABEL } from "@/lib/quiz";
import { adminLogout, approvePost, isAdmin, rejectPost } from "./actions";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "投稿の承認 | Keio Ramen Guide",
  robots: { index: false },
};

// 管理画面は常に動的（クッキー・DB依存）
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdmin();

  if (!authed) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">投稿の承認</h1>
        <p className="mt-2 text-sm text-muted">管理パスワードでログインしてください。</p>
        <LoginForm />
      </div>
    );
  }

  if (!isSupabaseReady()) {
    return (
      <div className="mx-auto max-w-xl">
        <Header />
        <p className="mt-6 rounded-lg border border-border bg-card p-5 text-sm text-muted">
          Supabaseが未設定のため、承認待ちの投稿を取得できません。READMEのセットアップ手順に従って設定してください。
        </p>
      </div>
    );
  }

  const pending = await getPendingPosts();

  return (
    <div className="mx-auto max-w-2xl">
      <Header />
      <p className="mt-4 text-sm text-muted">承認待ち：{pending.length}件</p>

      {pending.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted">
          承認待ちの投稿はありません。
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {pending.map((post) => {
            const shop = getShopById(post.shopId);
            return (
              <article key={post.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex gap-4">
                  {post.imageUrl ? (
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-border">
                      <Image src={post.imageUrl} alt={post.menuName} fill sizes="96px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md border border-border text-[11px] text-muted">
                      写真なし
                    </div>
                  )}
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-bold text-foreground">{shop?.name ?? post.shopId}</p>
                    <p className="mt-0.5 text-foreground">
                      {post.menuName}
                      {post.priceYen != null && <span className="ml-2 text-muted">¥{post.priceYen.toLocaleString()}</span>}
                    </p>
                    {post.body && <p className="mt-1 text-foreground/80">{post.body}</p>}
                    {post.sceneTags.length > 0 && (
                      <p className="mt-1 text-xs text-muted">
                        {post.sceneTags.map((t) => SCENE_LABEL[t]).join(" ・ ")}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted">
                      {post.nickname || "名無し"} ・ {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <form action={approvePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                      承認
                    </button>
                  </form>
                  <form action={rejectPost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted hover:border-accent hover:text-accent">
                      却下
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">投稿の承認</h1>
      <form action={adminLogout}>
        <button className="text-xs text-muted hover:text-accent">ログアウト</button>
      </form>
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : `${d.getMonth() + 1}/${d.getDate()}`;
}
