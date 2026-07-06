"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBrowserSupabase } from "@/lib/auth/browser";
import { ensureProfile } from "@/app/auth/actions";
import { copy } from "@/content/site-copy";
import { button } from "@/lib/design";

const c = copy.auth.signup;

export default function SignupForm() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const sb = getBrowserSupabase();
    if (!sb) {
      setError(copy.auth.disabledBody);
      setPending(false);
      return;
    }
    const { data, error: signUpError } = await sb.auth.signUp({
      email,
      password,
      options: { data: { handle, display_name: displayName } },
    });
    if (signUpError) {
      setError(c.error);
      setPending(false);
      return;
    }
    if (data.session) {
      // メール確認オフ → すぐにプロフィール作成して /me へ
      await ensureProfile(handle, displayName);
      router.push("/me");
      router.refresh();
      return;
    }
    // メール確認オン → 確認案内
    setCheckEmail(true);
    setPending(false);
  }

  if (checkEmail) {
    return (
      <div className="mt-8 max-w-sm rounded-md border border-border bg-card p-5 text-sm text-muted">
        <p>{c.checkEmail}</p>
        <Link href="/login" className={`${button.link} mt-3 inline-block`}>
          {copy.auth.login.title} →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex max-w-sm flex-col gap-4">
      {error && (
        <p className="rounded-md border border-accent/30 bg-accent-soft px-3.5 py-2.5 text-sm text-accent-dark">
          {error}
        </p>
      )}
      <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
        {c.displayName}
        <input
          type="text"
          required
          maxLength={30}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2.5 text-sm font-normal focus:border-foreground focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
        {c.handle}
        <input
          type="text"
          required
          minLength={3}
          maxLength={20}
          pattern="[A-Za-z0-9_]+"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2.5 text-sm font-normal focus:border-foreground focus:outline-none"
        />
        <span className="text-xs font-normal text-muted">{c.handleHint}</span>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
        {c.email}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2.5 text-sm font-normal focus:border-foreground focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
        {c.password}
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2.5 text-sm font-normal focus:border-foreground focus:outline-none"
        />
      </label>
      <button type="submit" disabled={pending} className={`${button.primary} disabled:opacity-50`}>
        {pending ? c.submitting : c.submit}
      </button>
      <Link href="/login" className="text-sm text-muted hover:text-foreground">
        {c.toLogin} →
      </Link>
    </form>
  );
}
