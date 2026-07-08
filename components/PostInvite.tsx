import Image from "next/image";
import Link from "next/link";
import { getShopById } from "@/lib/shops";
import { copy } from "@/content/site-copy";
import { button } from "@/lib/design";

// 投稿0件のときの招待ブロック。空状態を「これから並ぶ場所」として見せる。
// 実写真3枚（編集部の実食）を貼った写真の並びで、投稿が増えた未来像を先に見せる。
const STRIP_SHOPS = ["hiyoshi-musashiya", "yokohama-ishinshoten", "mita-jiro"];
const TILT = ["-rotate-2", "rotate-1", "-rotate-1"];

export default function PostInvite() {
  const shops = STRIP_SHOPS.map((id) => getShopById(id)).filter(Boolean);

  return (
    <div className="grid items-center gap-8 border-y border-border py-8 lg:grid-cols-[auto_1fr] lg:gap-12">
      <div className="flex justify-center gap-3 sm:gap-4 lg:justify-start">
        {shops.map((shop, i) => (
          <Link
            key={shop!.id}
            href={`/shops/${shop!.id}`}
            className={`group relative block h-24 w-24 shrink-0 overflow-hidden rounded-sm border border-border bg-card shadow-[2px_3px_0_rgba(17,16,14,0.08)] sm:h-28 sm:w-28 ${TILT[i]}`}
          >
            <Image
              src={shop!.squareImageUrl ?? shop!.thumbnailImageUrl!}
              alt={shop!.imageAlt ?? shop!.name}
              fill
              sizes="112px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </Link>
        ))}
      </div>

      <div>
        <p className="text-lg font-bold tracking-tight text-foreground">{copy.recentLogs.invite.lead}</p>
        <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted">
          {copy.recentLogs.invite.body}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link href="/post" className={button.primary}>
            {copy.recentLogs.invite.cta}
          </Link>
          <span className="text-xs text-muted">{copy.recentLogs.invite.note}</span>
        </div>
      </div>
    </div>
  );
}
