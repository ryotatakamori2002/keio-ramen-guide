"use server";

import { redirect } from "next/navigation";
import { getServerSupabase, getSessionUser } from "@/lib/auth/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getProfileById } from "@/lib/posts";

export interface EnsureProfileResult {
  ok: boolean;
  handle?: string;
  message?: string;
}

function sanitizeHandle(raw: string): string {
  const base = raw
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);
  return base.length >= 3 ? base : `user${Math.random().toString(36).slice(2, 8)}`;
}

// ログイン中ユーザーの profile を（無ければ）作成する。
// signup 直後は handle/displayName を引数で受け取り、以降のログインでは user_metadata から補完する。
export async function ensureProfile(handleArg?: string, displayNameArg?: string): Promise<EnsureProfileResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, message: "ログインが必要です。" };

  const existing = await getProfileById(user.id);
  if (existing) return { ok: true, handle: existing.handle };

  const db = getSupabaseAdmin();
  if (!db) return { ok: false, message: "サーバー設定が不足しています。" };

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const displayName =
    (displayNameArg || (meta.display_name as string) || "").trim() ||
    user.email?.split("@")[0] ||
    "ユーザー";
  let handle = sanitizeHandle(handleArg || (meta.handle as string) || displayName);

  // handle の重複を避ける（最大数回リトライ）
  for (let i = 0; i < 5; i += 1) {
    const { data: taken } = await db.from("profiles").select("id").eq("handle", handle).maybeSingle();
    if (!taken) break;
    handle = sanitizeHandle(`${handle}${Math.floor(Math.random() * 100)}`);
  }

  const { error } = await db.from("profiles").insert({
    id: user.id,
    handle,
    display_name: displayName,
  });
  if (error) return { ok: false, message: "プロフィールの作成に失敗しました。" };
  return { ok: true, handle };
}

export async function signOut(): Promise<void> {
  const sb = await getServerSupabase();
  if (sb) await sb.auth.signOut();
  redirect("/");
}
