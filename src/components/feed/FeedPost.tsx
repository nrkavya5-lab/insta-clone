"use client";

import { useState } from "react";
import FeedPostHeader from "./FeedPostHeader";
import CarouselViewer from "./CarouselViewer";
import FeedPostActions from "./FeedPostActions";
import FeedPostCaption from "./FeedPostCaption";
import FeedPostComments from "./FeedPostComments";

interface FeedPostProps {
  id: string;
  username: string;
  avatarUrl?: string | null;
  location?: string | null;
  mediaUrls: string[];
  caption: string;
  likeCount: number;
  commentCount: number;
  liked?: boolean;
  createdAt: string;
}

export default function FeedPost({
  id,
  username,
  avatarUrl,
  location,
  mediaUrls,
  caption,
  commentCount,
  liked: initialLiked,
  createdAt,
}: FeedPostProps) {
  const [liked, setLiked] = useState(initialLiked ?? false);
  const [likeCount, setLikeCount] = useState(0);

  const handleDoubleTapLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  return (
    <article className="border-b border-[var(--ig-border)] pb-2 mb-4 bg-[var(--ig-bg-primary)]">
      <FeedPostHeader
        username={username}
        avatarUrl={avatarUrl}
        location={location}
      />
      <div className="px-4">
        <div className="rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5">
          <CarouselViewer
            mediaUrls={mediaUrls}
            liked={liked}
            onDoubleTapLike={handleDoubleTapLike}
          />
        </div>
      </div>
      <FeedPostActions postId={id} initialLiked={liked} />
      <div className="px-4">
        <span className="text-sm font-bold">{likeCount + (liked && !initialLiked ? 1 : 0)} likes</span>
      </div>
      <FeedPostCaption username={username} caption={caption} />
      <FeedPostComments
        commentCount={commentCount}
        previewComment={commentCount > 0 ? { username: "commenter", text: "Great shot! 🔥" } : null}
      />
      <div className="px-4 pt-1">
        <time className="text-[10px] uppercase text-[var(--ig-text-secondary)] tracking-wide font-medium">
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}
