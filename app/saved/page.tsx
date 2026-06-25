"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSavedShops } from "@/hooks/useSavedShops";
import { getShopById } from "@/lib/shops";
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
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">保存リスト</h1>
        <p className="mt-2 text-sm text-muted">「行きたい」「行った」をつけたお店がここに集まります。</p>
      </div>

      <section>
        <h2 className="mb-4 border-b border-border pb-2 text-sm font-semibold text-foreground">
          行きたい <span className="text-muted">（{wantShops.length}）</span>
        </h2>
        {wantShops.length === 0 ? (
          <EmptyState message="まだ「行きたい」店がありません。" />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {wantShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 border-b border-border pb-2 text-sm font-semibold text-foreground">
          行った <span className="text-muted">（{visitedShops.length}）</span>
        </h2>
        {visitedShops.length === 0 ? (
          <EmptyState message="まだ「行った」店がありません。" />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visitedShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted">
      <p>{message}</p>
      <Link href="/shops" className="mt-2 inline-block font-medium text-accent hover:underline">
        店舗を探す →
      </Link>
    </div>
  );
}
