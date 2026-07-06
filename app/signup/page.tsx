import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseAuthReady } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth/server";
import { copy } from "@/content/site-copy";
import { type as t } from "@/lib/design";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: `${copy.auth.signup.title} | ${copy.serviceName}` };
export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (isSupabaseAuthReady()) {
    const user = await getSessionUser();
    if (user) redirect("/me");
  }

  return (
    <div className="mx-auto max-w-md py-4">
      <p className={t.eyebrow}>{copy.auth.signup.eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{copy.auth.signup.title}</h1>
      <p className="mt-2 text-sm text-muted">{copy.auth.signup.subtitle}</p>
      {isSupabaseAuthReady() ? (
        <SignupForm />
      ) : (
        <div className="mt-8 rounded-md border border-border bg-card p-5 text-sm text-muted">
          <p className="font-medium text-foreground">{copy.auth.disabledTitle}</p>
          <p className="mt-2">{copy.auth.disabledBody}</p>
        </div>
      )}
    </div>
  );
}
