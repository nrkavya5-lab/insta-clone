"use client";

import Avatar from "@/components/ui/Avatar";

interface MobileHeaderProps {
  title?: string;
}

export default function MobileHeader({ title }: MobileHeaderProps) {
  return (
    <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--ig-border)]">
      <Avatar size="sm" alt="Your story" hasStory />
      <div className="flex-1 overflow-x-auto flex gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <Avatar size="sm" alt={`User ${i}`} hasStory />
            <span className="text-[10px] text-[var(--ig-text-secondary)]">
              user_{i}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
