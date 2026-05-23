"use client";

import Avatar from "@/components/ui/Avatar";

interface StoryRingProps {
  username: string;
  avatarUrl?: string | null;
  hasStory?: boolean;
  onClick?: () => void;
}

export default function StoryRing({
  username,
  avatarUrl,
  hasStory = true,
  onClick,
}: StoryRingProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 flex-shrink-0 w-[68px] group"
    >
      <div className="transition-transform duration-200 group-hover:scale-105">
        {hasStory ? (
          <div className="p-[2.5px] rounded-full bg-gradient-to-br from-[#fcaf45] via-[#e1306c] to-[#833ab4]">
            <div className="rounded-full bg-[var(--ig-bg-primary)] p-[2px]">
              <Avatar src={avatarUrl} alt={username} size="md" />
            </div>
          </div>
        ) : (
          <Avatar src={avatarUrl} alt={username} size="md" />
        )}
      </div>
      <span className="text-[11px] text-[var(--ig-text-secondary)] truncate w-full text-center mt-0.5">
        {username}
      </span>
    </button>
  );
}
