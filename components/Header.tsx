import Link from "next/link";
import { copy } from "@/content/site-copy";
import { container } from "@/lib/design";
import HeaderNav from "./HeaderNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className={`${container} flex items-center justify-between gap-3 py-4`}>
        <Link href="/" className="flex shrink-0 flex-col leading-none">
          <span className="text-sm font-bold tracking-tight text-foreground">{copy.serviceName}</span>
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted">{copy.brandLine}</span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
