"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  initialLiked?: boolean;
  initialCount?: number;
  onLike?: () => void;
  onUnlike?: () => void;
}

export default function LikeButton({
  initialLiked = false,
  initialCount = 0,
  onLike,
  onUnlike,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [animating, setAnimating] = useState(false);

  function handleClick() {
    if (liked) {
      setLiked(false);
      onUnlike?.();
    } else {
      setLiked(true);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
      onLike?.();
    }
  }

  return (
    <button
      onClick={handleClick}
      className="p-1.5 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
      aria-label={liked ? "Unlike" : "Like"}
    >
      <Heart
        className={cn(
          "w-6 h-6 transition-all duration-200",
          liked
            ? "fill-[#ed4956] text-[#ed4956] drop-shadow-[0_0_4px_rgba(237,73,86,0.4)]"
            : "text-[var(--ig-text-primary)] hover:scale-110",
          animating && "animate-heart-bounce",
        )}
      />
    </button>
  );
}
