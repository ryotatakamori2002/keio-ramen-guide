import Image from "next/image";
import Link from "next/link";
import type { RamenPost } from "@/lib/types";
import { SCENE_LABEL } from "@/lib/quiz";
import { getShopById } from "@/lib/shops";
import { copy } from "@/content/site-copy";

// 承認済みの実食投稿。投稿者は profiles（display_name / @handle）を優先表示する。
export default function PostList({
  posts,
  showShop = false,
  showStatus = false,
}: {
  posts: RamenPost[];
  showShop?: boolean;
  showStatus?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {posts.map((post) => (
        <article key={post.id} className="overflow-hidden rounded-lg border border-border bg-card">
          {post.imageUrl && (
            <div className="relative aspect-[4/3] w-full bg-border">
              <Image
                src={post.imageUrl}
                alt={`${post.menuName}の写真`}
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            {showShop && <ShopLine post={post} />}
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-bold tracking-tight text-foreground">{post.menuName}</h3>
              {post.priceYen != null && (
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  ¥{post.priceYen.toLocaleString()}
                </span>
              )}
            </div>
            {post.body && <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{post.body}</p>}
            {post.sceneTags.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5 text-xs">
                {post.sceneTags.map((s) => (
                  <li key={s} className="rounded-full bg-background px-2 py-0.5 text-muted">
                    {SCENE_LABEL[s]}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2.5 flex items-center justify-between gap-2 text-xs text-muted">
              <Author post={post} />
              {showStatus && <StatusPill post={post} />}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Author({ post }: { post: RamenPost }) {
  if (post.author) {
    return (
      <Link href={`/users/${post.author.handle}`} className="hover:text-foreground">
        {post.author.displayName} <span className="text-muted">@{post.author.handle}</span>
        {post.approvedAt && ` · ${formatDate(post.approvedAt)}`}
        {!post.approvedAt && post.createdAt && ` · ${formatDate(post.createdAt)}`}
      </Link>
    );
  }
  const when = post.approvedAt ?? post.createdAt;
  return (
    <span>
      {post.nickname || copy.post.anon}
      {when && ` · ${formatDate(when)}`}
    </span>
  );
}

function ShopLine({ post }: { post: RamenPost }) {
  const shop = post.shopId ? getShopById(post.shopId) : null;
  if (shop) {
    return (
      <Link href={`/shops/${shop.id}`} className="mb-1 block text-xs text-muted hover:text-foreground">
        {shop.name} · {shop.area}
      </Link>
    );
  }
  const label = [post.shopNameManual, post.shopAreaManual].filter(Boolean).join(" · ");
  return label ? <p className="mb-1 text-xs text-muted">{label}</p> : null;
}

function StatusPill({ post }: { post: RamenPost }) {
  if (post.status !== "approved") {
    return <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px]">{copy.me.reviewing}</span>;
  }
  if (!post.isPublic) {
    return <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px]">{copy.me.private}</span>;
  }
  return null;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}
