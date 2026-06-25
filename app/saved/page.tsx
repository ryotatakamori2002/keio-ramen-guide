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
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-bold text-foreground">保存リスト</h1>
        <p className="mt-1 text-sm text-muted">「行きたい」「行った」をつけたお店がここに集まります。</p>
      </div>

      <section>
        <h2 className="text-sm font-bold text-foreground">行きたい（{wantShops.length}）</h2>
        <div className="mt-2 flex flex-col gap-3">
          {wantShops.length === 0 ? (
            <EmptyState message="まだ「行きたい」店がありません。店舗一覧でお店を探してみましょう。" />
          ) : (
            wantShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-foreground">行った（{visitedShops.length}）</h2>
        <div className="mt-2 flex flex-col gap-3">
          {visitedShops.length === 0 ? (
            <EmptyState message="まだ「行った」店がありません。行ったお店があれば記録してみましょう。" />
          ) : (
            visitedShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
      <p>{message}</p>
      <Link href="/shops" className="mt-2 inline-block text-sm font-semibold text-accent">
        店舗一覧を見る →
      </Link>
    </div>
  );
}
