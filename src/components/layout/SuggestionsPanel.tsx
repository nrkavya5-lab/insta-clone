"use client";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

const suggestions = [
  { name: "Jane Cooper", username: "janecooper" },
  { name: "Wade Warren", username: "wadewarren" },
  { name: "Esther Howard", username: "estherhoward" },
];

export default function SuggestionsPanel() {
  return (
    <aside className="hidden lg:block w-[319px] flex-shrink-0 pt-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[var(--ig-text-secondary)]">
          Suggestions For You
        </p>
        <button className="text-xs font-semibold hover:opacity-60 transition-opacity">
          See All
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {suggestions.map((user) => (
          <div
            key={user.username}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar size="sm" alt={user.name} />
              <div>
                <p className="text-sm font-semibold">{user.username}</p>
                <p className="text-xs text-[var(--ig-text-secondary)]">
                  {user.name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#405DE6] text-xs"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>
    </aside>
  );
}
