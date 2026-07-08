import Image from "next/image";
import Link from "next/link";
import { shelfLinks } from "@/lib/shelves";
import { getShopById } from "@/lib/shops";
import { copy } from "@/content/site-copy";

// シーンの棚。全部同じカードにせず、
// 上段＝写真棚3（実写真の上にシーン名）、下段＝文字棚3（罫線プレート）の2段でリズムを作る。
const PHOTO_SCENES: { id: string; shopId: string }[] = [
  { id: "hiyoshi-after-class", shopId: "hiyoshi-musashiya" },
  { id: "mita-lunch", shopId: "mita-jiro" },
  { id: "yokohama-nofail", shopId: "yokohama-ishinshoten" },
];
const TEXT_SCENES = ["solo", "after-drinking", "first-iekei"];

export default function SceneGuide() {
  const photoLinks = shelfLinks(PHOTO_SCENES.map((s) => s.id));
  const textLinks = shelfLinks(TEXT_SCENES);

  return (
    <div>
      {/* 上段: 写真棚 */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
        {photoLinks.map((link) => {
          const meta = copy.curated.titles[link.id];
          const shop = getShopById(PHOTO_SCENES.find((s) => s.id === link.id)?.shopId ?? "");
          const photo = shop?.squareImageUrl ?? shop?.thumbnailImageUrl;
          if (!meta || !photo) return null;
          return (
            <Link key={link.id} href={link.href} className="group relative block overflow-hidden">
              <div className="relative aspect-[16/9] w-full sm:aspect-square">
                <Image
                  src={photo}
                  alt={shop?.imageAlt ?? meta.ja}
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#11100e]/85 via-[#11100e]/20 to-transparent"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-lg font-bold tracking-tight text-[#f7f1e8]">{meta.ja}</p>
                <p className="mt-0.5 text-xs text-[#cfc6b8]">{meta.note}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 下段: 文字棚 */}
      <div className="mt-3 grid gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-5">
        {textLinks.map((link) => {
          const meta = copy.curated.titles[link.id];
          if (!meta) return null;
          return (
            <Link
              key={link.id}
              href={link.href}
              className="group flex items-center justify-between gap-3 border border-border bg-card px-4 py-3.5 transition-colors hover:border-foreground"
            >
              <span className="min-w-0">
                <span className="block font-semibold tracking-tight text-foreground">{meta.ja}</span>
                <span className="mt-0.5 block truncate text-xs text-muted">{meta.note}</span>
              </span>
              <span aria-hidden className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
