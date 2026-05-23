"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFeed } from "@/hooks/useFeed";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import StoriesBar from "@/components/feed/StoriesBar";
import FeedPost from "@/components/feed/FeedPost";
import Spinner from "@/components/ui/Spinner";
import Skeleton from "@/components/ui/Skeleton";
import { Sparkles, Users } from "lucide-react";

const tabs = [
  { key: "following", label: "Following", icon: Users },
  { key: "foryou", label: "For You", icon: Sparkles },
] as const;

export default function FeedPage() {
  const [tab, setTab] = useState<"following" | "foryou">("foryou");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFeed(tab);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: () => fetchNextPage(),
    hasNextPage,
    isFetchingNextPage,
  });

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  return (
    <div className="animate-fade-in">
      <div className="sticky top-0 z-10 bg-[var(--ig-bg-primary)] border-b border-[var(--ig-border)]">
        <div className="flex">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={cn(
                "flex-1 py-3 text-sm font-semibold relative transition-all duration-200 flex items-center justify-center gap-1.5",
                tab === key
                  ? "text-[var(--ig-text-primary)]"
                  : "text-[var(--ig-text-secondary)] hover:text-[var(--ig-text-primary)]",
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {tab === key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-[#405de6] to-[#e1306c] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <StoriesBar />

      {isLoading ? (
        <div className="p-4 flex flex-col gap-6 max-w-lg mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#405de6]/30 to-[#e1306c]/30 p-[2px]">
                  <div className="w-full h-full rounded-full bg-[var(--ig-bg-primary)]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-20 h-3 rounded" />
                  <Skeleton className="w-32 h-2.5 rounded" />
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden">
                <Skeleton className="w-full aspect-square rounded-xl" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-6 h-6 rounded" />
              </div>
              <Skeleton className="w-16 h-3 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-lg mx-auto">
          {posts.map((post) => (
            <FeedPost key={post.id} {...post} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-4" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#405de6]/10 to-[#e1306c]/10 text-sm font-semibold text-[#405de6]">
            <Spinner />
            Loading more...
          </div>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#405de6]/10 to-[#e1306c]/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-[#405de6]" />
          </div>
          <p className="text-sm font-semibold text-[var(--ig-text-primary)]">
            You&apos;re all caught up
          </p>
          <p className="text-xs text-[var(--ig-text-secondary)] mt-1">
            Come back later for more posts
          </p>
        </div>
      )}
    </div>
  );
}
