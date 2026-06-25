"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/shops", label: "店舗を探す" },
  { href: "/quiz", label: "気分で選ぶ" },
  { href: "/saved", label: "保存" },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0">
      <ul className="flex items-center gap-0.5 text-xs sm:gap-2 sm:text-sm">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block whitespace-nowrap rounded-md px-2 py-1.5 transition-colors sm:px-3 ${
                  active ? "bg-foreground text-white" : "text-muted hover:text-foreground"
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
