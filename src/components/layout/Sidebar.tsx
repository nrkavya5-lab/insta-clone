"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Compass,
  Clapperboard,
  Send,
  Heart,
  PlusSquare,
  User,
} from "lucide-react";

const navItems = [
  { href: "/feed", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/reels", label: "Reels", icon: Clapperboard },
  { href: "/messages", label: "Messages", icon: Send },
  { href: "/notifications", label: "Notifications", icon: Heart },
  { href: "/post/create", label: "Create", icon: PlusSquare },
  { href: "/profile/me", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[72px] lg:w-[244px] border-r border-[var(--ig-border)] bg-[var(--ig-bg-primary)] z-40">
      <div className="px-3 lg:px-6 py-6 mb-4">
        <Link href="/feed">
          <h1 className="hidden lg:block text-2xl font-bold gradient-text">
            Insta Clone
          </h1>
          <h1 className="lg:hidden text-2xl font-bold gradient-text text-center">
            I
          </h1>
        </Link>
      </div>
      <nav className="flex flex-col gap-0.5 px-2 lg:px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl text-sm transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-[#405de6]/10 to-[#e1306c]/10 font-bold text-[#405de6] shadow-sm"
                  : "hover:bg-[var(--ig-bg-tertiary)] text-[var(--ig-text-primary)]",
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform",
                  active && "scale-110 text-[#405de6]",
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-3 lg:px-6 py-4 border-t border-[var(--ig-border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#405de6] to-[#e1306c] flex items-center justify-center text-xs text-white font-bold">
            U
          </div>
          <span className="hidden lg:block text-sm font-semibold truncate">User</span>
        </div>
      </div>
    </aside>
  );
}
