"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSavedShops } from "@/hooks/useSavedShops";
import { getShopById } from "@/lib/shops";
import { copy } from "@/content/site-copy";
import { type as t } from "@/lib/design";
import ShopCard from "@/components/ShopCard";

export default function SavedPage() {
  const { wantIds, visitedIds } = useSavedShops();

  const wantShops = useMemo(
    () => wantIds.map((id) => getShopById(id)).filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [wantIds],
  );
  const visitedShops = useMemo(
    () => visitedIds.map((id) => getShopById(id)).filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [visitedIds],
  );

  return (
    <div className="py-2">
      <p className={t.eyebrow}>{copy.saved.eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{copy.saved.title}</h1>
      <p className="mt-2 text-sm text-muted">{copy.saved.subtitle}</p>

      <div className="mt-10 flex flex-col gap-12">
        <Group title={copy.saved.want} shops={wantShops} emptyCta />
        <Group title={copy.saved.visited} shops={visitedShops} />
      </div>
    </div>
  );
}

function Group({
  title,
  shops,
  emptyCta = false,
}: {
  title: string;
  shops: ReturnType<typeof getShopById>[];
  emptyCta?: boolean;
}) {
  const items = shops.filter((s): s is NonNullable<typeof s> => Boolean(s));
  return (
    <section>
      <h2 className="mb-4 border-b-2 border-foreground pb-2 text-sm font-semibold tracking-tight text-foreground">
        {title} <span className="font-normal text-muted">{items.length}</span>
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted">
          {copy.saved.empty}
          {emptyCta && (
            <>
              {" "}
              <Link href="/shops" className="font-medium text-accent hover:underline">
                {copy.saved.exploreCta} →
              </Link>
            </>
          )}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </section>
  );
}
