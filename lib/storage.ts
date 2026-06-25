const WANT_TO_GO_KEY = "keio-ramen-guide:want-to-go";
const VISITED_KEY = "keio-ramen-guide:visited";
const EMPTY: string[] = [];

type Listener = () => void;
const listeners = new Set<Listener>();

// useSyncExternalStore は getSnapshot が「変化していない限り同じ参照」を返すことを要求する。
// そのためキー毎にキャッシュし、実際に書き込みが起きた時だけ新しい配列を作る。
const cache = new Map<string, string[]>();

function emitChange(): void {
  for (const listener of listeners) listener();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined" && listeners.size === 1) {
    window.addEventListener("storage", handleStorageEvent);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined" && listeners.size === 0) {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

function handleStorageEvent(e: StorageEvent): void {
  if (e.key === WANT_TO_GO_KEY || e.key === VISITED_KEY) {
    cache.delete(e.key);
    emitChange();
  }
}

function parseIds(raw: string | null): string[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : EMPTY;
  } catch {
    return EMPTY;
  }
}

function readIds(key: string): string[] {
  if (typeof window === "undefined") return EMPTY;
  const cached = cache.get(key);
  if (cached) return cached;
  const ids = parseIds(window.localStorage.getItem(key));
  cache.set(key, ids);
  return ids;
}

function toggleId(key: string, id: string): void {
  const current = readIds(key);
  const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
  cache.set(key, next);
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(next));
  emitChange();
}

export function getWantToGoIds(): string[] {
  return readIds(WANT_TO_GO_KEY);
}

export function getVisitedIds(): string[] {
  return readIds(VISITED_KEY);
}

export function getServerSnapshot(): string[] {
  return EMPTY;
}

export function toggleWantToGo(id: string): void {
  toggleId(WANT_TO_GO_KEY, id);
}

export function toggleVisited(id: string): void {
  toggleId(VISITED_KEY, id);
}
