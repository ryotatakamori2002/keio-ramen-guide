"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBrowserSupabase } from "@/lib/auth/browser";
import { ensureProfile } from "@/app/auth/actions";
import { copy } from "@/content/site-copy";
import { button } from "@/lib/design";

const c = copy.auth.login;

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

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
    const { error: signInError } = await sb.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(c.error);
      setPending(false);
      return;
    }
    await ensureProfile();
    router.push("/me");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex max-w-sm flex-col gap-4">
      {error && (
        <p className="rounded-md border border-accent/30 bg-accent-soft px-3.5 py-2.5 text-sm text-accent-dark">
          {error}
        </p>
      )}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2.5 text-sm font-normal focus:border-foreground focus:outline-none"
        />
      </label>
      <button type="submit" disabled={pending} className={`${button.primary} disabled:opacity-50`}>
        {pending ? c.submitting : c.submit}
      </button>
      <Link href="/signup" className="text-sm text-muted hover:text-foreground">
        {c.toSignup} →
      </Link>
    </form>
  );
}
