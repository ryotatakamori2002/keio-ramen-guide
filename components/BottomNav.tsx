"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "トップ", icon: "🏠" },
  { href: "/shops", label: "一覧", icon: "🍜" },
  { href: "/quiz", label: "診断", icon: "🎯" },
  { href: "/saved", label: "保存", icon: "❤️" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-2xl justify-between px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
