"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Grid, Play } from "lucide-react";

interface Post {
  id: string;
  mediaUrls: string[];
  mediaType: string;
  likeCount: number;
  commentCount: number;
}

interface ProfileGridProps {
  posts: Post[];
  loading?: boolean;
  emptyMessage?: string;
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/p/${post.id}`}
      className="relative aspect-square bg-[var(--ig-bg-tertiary)] group overflow-hidden"
    >
      <Image
        src={post.mediaUrls[0]}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 33vw, 293px"
        loading="lazy"
      />
      {post.mediaType === "video" && (
        <div className="absolute top-2 right-2">
          <Play className="w-4 h-4 text-white drop-shadow" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm font-semibold">
        <span>
          <svg
            className="w-5 h-5 inline mr-1"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {post.likeCount}
        </span>
        <span>
          <svg
            className="w-5 h-5 inline mr-1"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
          </svg>
          {post.commentCount}
        </span>
      </div>
    </Link>
  );
}

export default function ProfileGrid({
  posts,
  loading,
  emptyMessage = "No posts yet",
}: ProfileGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1 px-4 md:px-0">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-[var(--ig-bg-tertiary)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--ig-text-secondary)]">
        <Grid className="w-12 h-12 mb-4" />
        <p className="text-xl font-light">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 px-4 md:px-0">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
