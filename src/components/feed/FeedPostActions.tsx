"use client";

import { MessageCircle, Send, Bookmark } from "lucide-react";
import LikeButton from "./LikeButton";

interface FeedPostActionsProps {
  postId: string;
  initialLiked?: boolean;
  initialSaved?: boolean;
  onCommentClick?: () => void;
}

export default function FeedPostActions({
  initialLiked,
  initialSaved,
  onCommentClick,
}: FeedPostActionsProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-5">
        <LikeButton initialLiked={initialLiked} initialCount={0} />
        <button
          onClick={onCommentClick}
          className="p-1.5 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
          aria-label="Comment"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        <button
          className="p-1.5 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
          aria-label="Share"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
      <button
        className="p-1.5 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
        aria-label="Save"
      >
        <Bookmark className="w-6 h-6" />
      </button>
    </div>
  );
}
