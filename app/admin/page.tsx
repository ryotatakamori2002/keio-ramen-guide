import type { Metadata } from "next";
import Image from "next/image";
import { getShopById } from "@/lib/shops";
import { getPendingPosts } from "@/lib/posts";
import { getPendingShopRequests } from "@/lib/shop-requests";
import { isSupabaseReady } from "@/lib/supabase";
import { SCENE_LABEL } from "@/lib/quiz";
import { copy } from "@/content/site-copy";
import { acceptShopRequest, adminLogout, approvePost, isAdmin, rejectPost, rejectShopRequest } from "./actions";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: `${copy.admin.title} | ${copy.serviceName}`,
  robots: { index: false },
};

// 管理画面は常に動的（クッキー・DB依存）
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdmin();

  if (!authed) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{copy.admin.title}</h1>
        <p className="mt-2 text-sm text-muted">{copy.admin.loginPrompt}</p>
        <LoginForm />
      </div>
    );
  }

  if (!isSupabaseReady()) {
    return (
      <div className="mx-auto max-w-xl">
        <Header />
        <p className="mt-6 rounded-lg border border-border bg-card p-5 text-sm text-muted">
          {copy.admin.notConfigured}
        </p>
      </div>
    );
  }

  const pending = await getPendingPosts();
  const shopRequests = await getPendingShopRequests();

  return (
    <div className="mx-auto max-w-2xl">
      <Header />
      <p className="mt-4 text-sm text-muted">{copy.admin.pendingCount(pending.length)}</p>

      {pending.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted">
          {copy.admin.empty}
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
                      {copy.admin.noPhoto}
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
                      {post.nickname || copy.admin.anon} · {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <form action={approvePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90">
                      {copy.admin.approve}
                    </button>
                  </form>
                  <form action={rejectPost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:border-foreground hover:text-foreground">
                      {copy.admin.reject}
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 店舗掲載リクエスト（/shops/request から） */}
      <h2 className="mt-12 border-t border-border pt-8 text-lg font-bold tracking-tight text-foreground">
        店舗リクエスト <span className="ml-1 text-sm font-normal text-muted">{shopRequests.length}件</span>
      </h2>
      {shopRequests.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          確認待ちのリクエストはありません。（一覧が出ない場合は supabase/schema.sql を再実行してください）
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {shopRequests.map((req) => (
            <article key={req.id} className="rounded-lg border border-border bg-card p-4 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-bold text-foreground">{req.shopName}</p>
                <span className="shrink-0 text-xs text-muted">{formatDate(req.createdAt)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {[req.area, req.station, req.genre].filter(Boolean).join(" · ") || "エリア・駅・ジャンル未記入"}
              </p>
              {req.reason && <p className="mt-2 leading-relaxed text-foreground/85">{req.reason}</p>}
              <p className="mt-1.5 text-xs text-muted">
                {req.requesterName || copy.admin.anon}
                {req.mapUrl && (
                  <>
                    {" ・ "}
                    <a href={req.mapUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent">
                      Google Mapsで確認
                    </a>
                  </>
                )}
              </p>
              <div className="mt-3 flex gap-2">
                <form action={acceptShopRequest}>
                  <input type="hidden" name="id" value={req.id} />
                  <button className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90">
                    店舗として追加
                  </button>
                </form>
                <form action={rejectShopRequest}>
                  <input type="hidden" name="id" value={req.id} />
                  <button className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:border-foreground hover:text-foreground">
                    見送る
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{copy.admin.title}</h1>
      <form action={adminLogout}>
        <button className="text-xs text-muted hover:text-accent">{copy.admin.logout}</button>
      </form>
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : `${d.getMonth() + 1}/${d.getDate()}`;
}
