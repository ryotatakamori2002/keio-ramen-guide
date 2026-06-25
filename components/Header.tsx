import Link from "next/link";

const NAV_ITEMS = [
  { href: "/shops", label: "店舗一覧" },
  { href: "/quiz", label: "気分診断" },
  { href: "/saved", label: "保存" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-base font-bold tracking-tight text-foreground sm:text-lg">
          🍜 Keio Ramen Guide
        </Link>
        <nav className="hidden gap-5 text-sm font-medium sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted transition-colors hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
