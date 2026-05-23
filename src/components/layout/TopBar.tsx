"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function TopBar() {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 border-b border-[var(--ig-border)] bg-[var(--ig-bg-primary)]">
      <div className="flex items-center justify-between px-4 h-11">
        <Link href="/feed" className="text-xl font-bold gradient-text">
          Insta Clone
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/notifications" aria-label="Notifications">
            <NotificationBell />
          </Link>
          <Link
            href="/messages"
            aria-label="Messages"
            className="p-1.5 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
          >
            <Send className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
