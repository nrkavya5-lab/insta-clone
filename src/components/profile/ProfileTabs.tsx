"use client";

import { cn } from "@/lib/utils";
import { Grid, Film, Bookmark, Tag } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showSaved?: boolean;
}

const defaultTabs: Tab[] = [
  { id: "posts", label: "Posts", icon: <Grid className="w-3 h-3" /> },
  { id: "reels", label: "Reels", icon: <Film className="w-3 h-3" /> },
  { id: "tagged", label: "Tagged", icon: <Tag className="w-3 h-3" /> },
];

export default function ProfileTabs({
  activeTab,
  onTabChange,
  showSaved,
}: ProfileTabsProps) {
  const tabs = showSaved
    ? [
        ...defaultTabs.slice(0, 1),
        { id: "saved", label: "Saved", icon: <Bookmark className="w-3 h-3" /> },
        ...defaultTabs.slice(2),
      ]
    : defaultTabs;

  return (
    <div className="flex border-t border-[var(--ig-border)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-wide border-t border-transparent -mt-px transition-colors",
            activeTab === tab.id
              ? "text-[var(--ig-text-primary)] border-t-[var(--ig-text-primary)]"
              : "text-[var(--ig-text-secondary)] hover:text-[var(--ig-text-primary)]",
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
