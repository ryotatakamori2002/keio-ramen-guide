import Link from "next/link";
import HeaderNav from "./HeaderNav";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="font-serif text-lg tracking-wide text-foreground sm:text-xl">
          Keio Ramen Guide
        </Link>
        <p className="hidden text-xs text-muted sm:block">日吉・三田・横浜のラーメン案内</p>
      </div>
      <HeaderNav />
    </header>
  );
}
