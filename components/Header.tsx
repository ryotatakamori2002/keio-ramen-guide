import Link from "next/link";
import { copy } from "@/content/site-copy";
import { container } from "@/lib/design";
import BrandMark from "./BrandMark";
import HeaderNav from "./HeaderNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className={`${container} flex items-center justify-between gap-3 py-3.5`}>
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <BrandMark className="h-6 w-6" />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-foreground">{copy.serviceName}</span>
            <span className="mt-1 text-[10px] tracking-[0.14em] text-muted">{copy.brandLine}</span>
          </span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
