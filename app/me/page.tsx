import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseAuthReady } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth/server";
import { getPostsByUser, getProfileById } from "@/lib/posts";
import { getShopById } from "@/lib/shops";
import { signOut } from "@/app/auth/actions";
import { copy } from "@/content/site-copy";
import { button, type as t } from "@/lib/design";
import PostList from "@/components/PostList";

export const metadata: Metadata = { title: `${copy.me.title} | ${copy.serviceName}`, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function MePage() {
  const user = isSupabaseAuthReady() ? await getSessionUser() : null;

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-4">
        <p className={t.eyebrow}>{copy.me.eyebrow}</p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{copy.me.title}</h1>
        {isSupabaseAuthReady() ? (
          <>
            <p className="mt-2 text-sm text-muted">{copy.me.loginPrompt}</p>
            <Link href="/login" className={`${button.primary} mt-6`}>
              {copy.me.login}
            </Link>
          </>
        ) : (
          <div className="mt-8 rounded-md border border-border bg-card p-5 text-sm text-muted">
            <p className="font-medium text-foreground">{copy.auth.disabledTitle}</p>
            <p className="mt-2">{copy.auth.disabledBody}</p>
          </div>
        )}
      </div>
    );
  }

  const profile = await getProfileById(user.id);
  const posts = await getPostsByUser(user.id);
  const displayName = profile?.displayName ?? user.email?.split("@")[0] ?? "ユーザー";
  const handle = profile?.handle;

  const shopKeys = new Set<string>();
  const areas = new Set<string>();
  const genres = new Set<string>();
  for (const p of posts) {
    if (p.shopId) {
      shopKeys.add(p.shopId);
      const shop = getShopById(p.shopId);
      if (shop) {
        areas.add(shop.area);
        shop.genres.forEach((g) => genres.add(g));
      }
    } else if (p.shopNameManual) {
      shopKeys.add(`manual:${p.shopNameManual}`);
      if (p.shopAreaManual) areas.add(p.shopAreaManual);
    }
  }

  const stats = [
    { label: copy.me.stats.posts, value: posts.length },
    { label: copy.me.stats.shops, value: shopKeys.size },
    { label: copy.me.stats.areas, value: areas.size },
    { label: copy.me.stats.genres, value: genres.size },
  ];

  return (
    <div className="mx-auto max-w-2xl py-2">
      <p className={t.eyebrow}>{copy.me.eyebrow}</p>
      <div className="mt-1.5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{displayName}</h1>
          {handle && <p className="mt-0.5 text-sm text-muted">@{handle}</p>}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {handle && (
            <Link href={`/users/${handle}`} className={button.quiet}>
              {copy.me.publicProfile}
            </Link>
          )}
          <form action={signOut}>
            <button className="text-muted hover:text-foreground">{copy.me.logout}</button>
          </form>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-4 gap-2 rounded-lg border border-border bg-card p-4 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="text-xl font-bold text-foreground">{s.value}</dd>
            <dt className="mt-0.5 text-[11px] text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex items-end justify-between">
        <h2 className="text-lg font-bold tracking-tight text-foreground">{copy.me.postsTitle}</h2>
        <Link href="/post" className="text-xs font-medium text-muted hover:text-accent">
          {copy.me.addLog} →
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="mt-4">
          <PostList posts={posts} showShop showStatus />
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">
          {copy.me.empty}{" "}
          <Link href="/post" className={button.link}>
            {copy.me.addLog} →
          </Link>
        </p>
      )}
    </div>
  );
}
