import Link from "next/link";
import { copy } from "@/content/site-copy";
import { button, type as t } from "@/lib/design";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-28 text-center">
      <p className={t.eyebrow}>404</p>
      <h1 className="text-xl font-bold tracking-tight text-foreground">{copy.notFound.title}</h1>
      <p className="text-sm text-muted">{copy.notFound.body}</p>
      <Link href="/shops" className={`${button.small} mt-3`}>
        {copy.notFound.cta}
      </Link>
    </div>
  );
}
