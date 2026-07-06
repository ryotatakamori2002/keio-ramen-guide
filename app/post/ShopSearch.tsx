"use client";

import { useMemo, useState } from "react";
import { copy } from "@/content/site-copy";

export interface ShopOption {
  id: string;
  name: string;
  area: string;
}

const f = copy.post.fields;
const NEW_AREAS = ["日吉", "三田", "横浜", "その他"];

// 巨大な select をやめ、検索で既存店舗を選ぶ / 見つからなければ新規店舗として入力する UI。
export default function ShopSearch({
  shops,
  initialShopId,
}: {
  shops: ShopOption[];
  initialShopId: string;
}) {
  const initial = shops.find((s) => s.id === initialShopId) ?? null;
  const [selected, setSelected] = useState<ShopOption | null>(initial);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"search" | "new">("search");
  const [newName, setNewName] = useState("");
  const [newArea, setNewArea] = useState("日吉");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return shops
      .filter((s) => `${s.name} ${s.area}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [shops, query]);

  // 選択済み（既存店舗）
  if (mode === "search" && selected) {
    return (
      <div>
        {/* form に渡す値 */}
        <input type="hidden" name="shopId" value={selected.id} />
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-sm">
          <span className="text-foreground">
            {selected.name} <span className="text-muted">· {selected.area}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setQuery("");
            }}
            className="shrink-0 text-xs text-muted hover:text-accent"
          >
            {f.change}
          </button>
        </div>
      </div>
    );
  }

  // 新規店舗入力
  if (mode === "new") {
    return (
      <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-3">
        <input type="hidden" name="shopId" value="" />
        <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
          {f.newShopName}
          <input
            type="text"
            name="newShopName"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal focus:border-foreground focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
          {f.newShopArea}
          <select
            name="newShopArea"
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal focus:border-foreground focus:outline-none"
          >
            {NEW_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
          {f.newShopMemo}
          <input
            type="text"
            name="newShopMemo"
            placeholder={f.newShopMemoPlaceholder}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal placeholder:text-muted focus:border-foreground focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() => setMode("search")}
          className="self-start text-xs text-muted hover:text-foreground"
        >
          {f.backToSearch}
        </button>
      </div>
    );
  }

  // 検索
  return (
    <div>
      <input type="hidden" name="shopId" value="" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={f.shopSearchPlaceholder}
        className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
      />
      {matches.length > 0 && (
        <ul className="mt-2 overflow-hidden rounded-md border border-border">
          {matches.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(s);
                  setMode("search");
                }}
                className="flex w-full items-center justify-between gap-3 bg-card px-3 py-2 text-left text-sm hover:bg-background"
              >
                <span className="text-foreground">{s.name}</span>
                <span className="shrink-0 text-xs text-muted">{s.area}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-xs text-muted">
        {f.shopNotFound}{" "}
        <button
          type="button"
          onClick={() => setMode("new")}
          className="font-medium text-accent hover:underline"
        >
          {f.newShopToggle}
        </button>
      </p>
    </div>
  );
}
