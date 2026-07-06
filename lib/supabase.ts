import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 投稿画像を入れる Storage バケット。
export const STORAGE_BUCKET = "ramen-post-images";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 投稿機能（書き込み・承認・画像アップロード）はサーバーで service role を使う。
// それが揃っているかどうかで「投稿機能が有効か」を判断する。
export function isSupabaseReady(): boolean {
  return Boolean(url && serviceKey);
}

// 公開側で anon key が設定されているか（将来クライアント読み取りに使う想定）。
export function isSupabasePublicReady(): boolean {
  return Boolean(url && anonKey);
}

// 認証（ログイン/新規登録）が使えるか。URL + anon key が必要。
export function isSupabaseAuthReady(): boolean {
  return Boolean(url && anonKey);
}

// サーバー専用クライアント。service role キーはクライアントへ絶対に渡さない。
let adminClient: SupabaseClient | null | undefined;
export function getSupabaseAdmin(): SupabaseClient | null {
  if (adminClient !== undefined) return adminClient;
  adminClient = url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null;
  return adminClient;
}
