"use client";

import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// クライアント側の Supabase（ログイン/新規登録/ログアウト用）。未設定なら null。
export function getBrowserSupabase() {
  if (!url || !anon) return null;
  return createBrowserClient(url, anon);
}
