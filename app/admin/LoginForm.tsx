"use client";

import { useActionState } from "react";
import { adminLogin, type AdminLoginState } from "./actions";

const initialState: AdminLoginState = { ok: false, message: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <form action={formAction} className="mt-6 flex max-w-sm flex-col gap-3">
      {state.message && !state.ok && (
        <p className="rounded-md border border-accent/30 bg-accent-soft px-3 py-2 text-sm text-accent-dark">
          {state.message}
        </p>
      )}
      <input
        type="password"
        name="password"
        required
        placeholder="管理パスワード"
        className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-foreground px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "確認中…" : "ログイン"}
      </button>
    </form>
  );
}
