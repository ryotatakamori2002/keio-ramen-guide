import Link from "next/link";
import HeaderNav from "./HeaderNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-baseline gap-2">
          <span className="whitespace-nowrap text-sm font-bold tracking-tight text-foreground sm:text-base">
            Keio Ramen Guide
          </span>
          <span className="hidden text-xs text-muted sm:inline">日吉・三田・横浜</span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
