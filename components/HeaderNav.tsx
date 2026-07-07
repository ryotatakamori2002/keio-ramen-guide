"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy } from "@/content/site-copy";

// 「気分で選ぶ」はトップと /shops からの導線に任せ、ヘッダーは3項目に絞る（モバイル幅対策）。
const NAV_ITEMS = [
  { href: "/shops", label: copy.nav.shops },
  { href: "/post", label: copy.nav.post },
  { href: "/saved", label: copy.nav.saved },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0">
      <ul className="flex items-center gap-1 text-sm sm:gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-full px-3 py-1.5 tracking-tight transition-colors ${
                  active ? "bg-foreground text-background" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
