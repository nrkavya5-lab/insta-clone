"use client";

import { useState } from "react";
import { Heart, MessageCircle, Bookmark, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api-client";

interface ReelActionsProps {
  postId: string;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  saved: boolean;
}

export default function ReelActions({
  postId,
  liked: initialLiked,
  likeCount: initialLikes,
  commentCount,
  saved: initialSaved,
}: ReelActionsProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [animating, setAnimating] = useState(false);

  const toggleLike = async () => {
    const prev = liked;
    setLiked(!liked);
    setLikeCount((c) => (prev ? c - 1 : c + 1));
    if (!prev) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
    }
    try {
      if (prev) {
        await apiFetch(`/reels/${postId}/unlike`, { method: "DELETE" });
      } else {
        await apiFetch(`/reels/${postId}/like`, { method: "POST" });
      }
    } catch {
      setLiked(prev);
      setLikeCount((c) => (prev ? c + 1 : c - 1));
    }
  };

  const toggleSave = async () => {
    const prev = saved;
    setSaved(!saved);
    try {
      if (prev) {
        await apiFetch(`/posts/${postId}/unsave`, { method: "DELETE" });
      } else {
        await apiFetch(`/posts/${postId}/save`, { method: "POST" });
      }
    } catch {
      setSaved(prev);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <button
        onClick={toggleLike}
        className="flex flex-col items-center gap-0.5 group"
        aria-label="Like"
      >
        <Heart
          className={cn(
            "w-7 h-7 transition-all duration-200 group-hover:scale-110",
            liked
              ? "text-[#ed4956] fill-[#ed4956] drop-shadow-[0_0_6px_rgba(237,73,86,0.5)]"
              : "text-white",
            animating && "animate-heart-bounce",
          )}
        />
        <span className="text-xs font-semibold text-white">{likeCount}</span>
      </button>
      <button
        onClick={() => {}}
        className="flex flex-col items-center gap-0.5 group"
        aria-label="Comment"
      >
        <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        <span className="text-xs font-semibold text-white">{commentCount}</span>
      </button>
      <button
        onClick={toggleSave}
        className="flex flex-col items-center gap-0.5 group"
        aria-label="Save"
      >
        <Bookmark
          className={cn(
            "w-7 h-7 group-hover:scale-110 transition-all",
            saved ? "text-white fill-white" : "text-white",
          )}
        />
      </button>
      <button
        onClick={() => {}}
        className="flex flex-col items-center gap-0.5 group"
        aria-label="Share"
      >
        <Send className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
