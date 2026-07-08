"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy } from "@/content/site-copy";

// ヘッダーは主要4導線。「保存」は幅の都合でsm以上のみ表示（フッターには常にある）。
// 「気分で選ぶ」はトップと/shopsからの導線に任せる。
const NAV_ITEMS = [
  { href: "/shops", label: copy.nav.shops, always: true },
  { href: "/map", label: copy.nav.map, always: true },
  { href: "/post", label: copy.nav.post, always: true },
  { href: "/insights", label: copy.nav.insights, always: true },
  { href: "/saved", label: copy.nav.saved, always: false },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0">
      <ul className="flex items-center gap-0.5 text-sm sm:gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href} className={item.always ? "" : "hidden sm:block"}>
              <Link
                href={item.href}
                className={`block rounded-full px-2.5 py-1.5 tracking-tight transition-colors sm:px-3 ${
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
