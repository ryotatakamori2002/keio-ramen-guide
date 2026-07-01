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
        <Group title={copy.saved.want} shops={wantShops} />
        <Group title={copy.saved.visited} shops={visitedShops} />
      </div>
    </div>
  );
}

function Group({ title, shops }: { title: string; shops: ReturnType<typeof getShopById>[] }) {
  const items = shops.filter((s): s is NonNullable<typeof s> => Boolean(s));
  return (
    <section>
      <h2 className="mb-4 border-b border-border pb-2 text-sm font-semibold tracking-tight text-foreground">
        {title} <span className="font-normal text-muted">{items.length}</span>
      </h2>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted">
          <p>{copy.saved.empty}</p>
          <Link href="/shops" className="mt-2 inline-block font-medium text-accent hover:underline">
            {copy.saved.exploreCta} →
          </Link>
        </div>
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
