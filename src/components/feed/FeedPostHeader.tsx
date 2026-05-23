"use client";

import { MoreHorizontal } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

interface FeedPostHeaderProps {
  username: string;
  avatarUrl?: string | null;
  location?: string | null;
}

export default function FeedPostHeader({
  username,
  avatarUrl,
  location,
}: FeedPostHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="p-[2px] rounded-full bg-gradient-to-br from-[#fcaf45] via-[#e1306c] to-[#833ab4]">
          <div className="rounded-full bg-[var(--ig-bg-primary)] p-[2px]">
            <Avatar src={avatarUrl} alt={username} size="sm" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold">{username}</p>
            {username === "alice_dev" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#405de6]/10 text-[#405de6] font-semibold">
                Verified
              </span>
            )}
          </div>
          {location && (
            <p className="text-[11px] text-[var(--ig-text-secondary)]">
              📍 {location}
            </p>
          )}
        </div>
      </div>
      <button
        className="p-1.5 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
        aria-label="More options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
