"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, isSupabaseReady } from "@/lib/supabase";

const ADMIN_COOKIE = "krg_admin";

export interface AdminLoginState {
  ok: boolean;
  message: string;
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === "1";
}

export async function adminLogin(_prev: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false, message: "ADMIN_PASSWORD が未設定です。.env に設定してください。" };
  }
  if (password !== expected) {
    return { ok: false, message: "パスワードが違います。" };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  revalidatePath("/admin");
  return { ok: true, message: "ログインしました。" };
}

export async function adminLogout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  revalidatePath("/admin");
}

async function setStatus(id: string, status: "approved" | "rejected"): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  if (!isSupabaseReady()) return;
  const db = getSupabaseAdmin();
  if (!db) return;
  await db
    .from("ramen_posts")
    .update({ status, approved_at: status === "approved" ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/admin");
}

export async function approvePost(formData: FormData): Promise<void> {
  await setStatus(String(formData.get("id") ?? ""), "approved");
}

export async function rejectPost(formData: FormData): Promise<void> {
  await setStatus(String(formData.get("id") ?? ""), "rejected");
}
