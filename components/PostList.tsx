import Image from "next/image";
import type { RamenPost } from "@/lib/types";
import { SCENE_LABEL } from "@/lib/quiz";

// 慶應生の実食投稿（承認済み）。写真がある投稿を強く見せる。
export default function PostList({ posts }: { posts: RamenPost[] }) {
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
          <div className="p-3.5">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-bold text-foreground">{post.menuName}</h3>
              {post.priceYen != null && (
                <span className="shrink-0 text-sm font-semibold text-accent">¥{post.priceYen.toLocaleString()}</span>
              )}
            </div>
            {post.body && <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{post.body}</p>}
            {post.sceneTags.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5 text-xs">
                {post.sceneTags.map((t) => (
                  <li key={t} className="rounded bg-background px-1.5 py-0.5 text-muted">
                    {SCENE_LABEL[t]}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-muted">
              {post.nickname || "名無しの慶應生"}
              {post.approvedAt && ` ・ ${formatDate(post.approvedAt)}`}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}
