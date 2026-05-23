"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { POSTS_PER_PAGE } from "@/lib/constants";

interface Post {
  id: string;
  username: string;
  avatarUrl: string | null;
  location: string | null;
  mediaUrls: string[];
  caption: string;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  createdAt: string;
}

interface FeedResponse {
  posts: Post[];
  nextCursor: string | null;
}

export function useFeed(tab: "following" | "foryou" = "following") {
  return useInfiniteQuery<FeedResponse>({
    queryKey: ["feed", tab],
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam ? `&cursor=${pageParam}` : "";
      return apiFetch<FeedResponse>(
        `/posts?tab=${tab}&limit=${POSTS_PER_PAGE}${cursor}&__dev=1`,
      );
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });
}
