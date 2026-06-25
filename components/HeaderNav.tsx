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
    <nav className="mx-auto max-w-3xl px-5 sm:px-8">
      <ul className="flex gap-5 text-sm sm:gap-7">
        {NAV_ITEMS.map((item, i) => {
          const active = pathname.startsWith(item.href);
          const primary = i === 0;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`inline-block border-b-2 py-2.5 transition-colors ${
                  active
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted hover:text-foreground"
                } ${primary ? "font-semibold" : ""}`}
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
