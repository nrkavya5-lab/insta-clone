"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, PlusSquare, Clapperboard, User } from "lucide-react";

const items = [
  { href: "/feed", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/post/create", icon: PlusSquare, label: "Create" },
  { href: "/reels", icon: Clapperboard, label: "Reels" },
  { href: "/profile/me", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--ig-border)] bg-[var(--ig-bg-primary)]">
      <div className="flex items-center justify-around py-2">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                "p-2 rounded-xl transition-all duration-200",
                active
                  ? "text-[#405de6] bg-[#405de6]/10"
                  : "text-[var(--ig-text-secondary)] hover:text-[var(--ig-text-primary)] hover:bg-[var(--ig-bg-tertiary)]",
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
