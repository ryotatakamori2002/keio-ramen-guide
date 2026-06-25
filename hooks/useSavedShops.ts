"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getVisitedIds,
  getWantToGoIds,
  subscribe,
  toggleVisited,
  toggleWantToGo,
} from "@/lib/storage";

export function useSavedShops() {
  // useSyncExternalStore は、サーバーでは getServerSnapshot（空配列）を使い、
  // クライアントでのhydration後にlocalStorageの実際の値へ安全に切り替えてくれる。
  const wantIds = useSyncExternalStore(subscribe, getWantToGoIds, getServerSnapshot);
  const visitedIds = useSyncExternalStore(subscribe, getVisitedIds, getServerSnapshot);

  const toggleWant = useCallback((id: string) => toggleWantToGo(id), []);
  const toggleGone = useCallback((id: string) => toggleVisited(id), []);
  const isWant = useCallback((id: string) => wantIds.includes(id), [wantIds]);
  const isVisited = useCallback((id: string) => visitedIds.includes(id), [visitedIds]);

  return { wantIds, visitedIds, toggleWant, toggleGone, isWant, isVisited };
}
