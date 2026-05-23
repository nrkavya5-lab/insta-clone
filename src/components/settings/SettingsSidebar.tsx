"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/settings/edit", label: "Edit profile" },
  { href: "/settings/privacy", label: "Privacy" },
  { href: "/settings/security", label: "Security" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/appearance", label: "Appearance" },
  { href: "/settings/close-friends", label: "Close friends" },
  { href: "/settings/blocked", label: "Blocked" },
  { href: "/settings/account", label: "Account" },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "px-3 py-2.5 text-sm rounded transition-colors",
            pathname === href
              ? "bg-[var(--ig-bg-tertiary)] font-semibold"
              : "hover:bg-[var(--ig-bg-tertiary)]",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
