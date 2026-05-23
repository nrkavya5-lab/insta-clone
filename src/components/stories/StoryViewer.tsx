"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Avatar from "@/components/ui/Avatar";
import { X, ChevronDown, Send, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  stories: Array<{
    id: string;
    mediaUrl: string;
    mediaType: string;
    caption?: string;
    viewed: boolean;
    createdAt: string;
  }>;
}

interface StoryViewerProps {
  users: StoryUser[];
  initialIndex?: number;
  onClose: () => void;
}

const STORY_DURATION = 5000;

export default function StoryViewer({
  users,
  initialIndex = 0,
  onClose,
}: StoryViewerProps) {
  const [userIdx, setUserIdx] = useState(initialIndex);
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const currentUser = users[userIdx];
  const currentStory = currentUser?.stories[storyIdx];
  const totalStories = currentUser?.stories.length ?? 0;

  const advance = useCallback(() => {
    if (storyIdx < totalStories - 1) {
      setStoryIdx((i) => i + 1);
      setProgress(0);
    } else if (userIdx < users.length - 1) {
      setUserIdx((i) => i + 1);
      setStoryIdx(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [storyIdx, totalStories, userIdx, users.length, onClose]);

  const goBack = useCallback(() => {
    if (storyIdx > 0) {
      setStoryIdx((i) => i - 1);
      setProgress(0);
    } else if (userIdx > 0) {
      setUserIdx((i) => i - 1);
      const prevLen = users[userIdx - 1]?.stories.length ?? 0;
      setStoryIdx(Math.max(prevLen - 1, 0));
      setProgress(0);
    }
  }, [storyIdx, userIdx, users]);

  useEffect(() => {
    if (paused || !currentStory) return;
    const start = Date.now() - (progress / 100) * STORY_DURATION;
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current!);
        advance();
      }
    }, 50);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStory, paused, advance, progress]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goBack();
      if (e.key === "ArrowRight") advance();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [advance, goBack, onClose]);

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.33) goBack();
    else if (x > rect.width * 0.66) advance();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dy) > 80) {
      onClose();
      return;
    }
    if (dx < -60) advance();
    else if (dx > 60) goBack();
  };

  const markViewed = async () => {
    if (!currentStory) return;
    try {
      await fetch(`/api/stories/${currentStory.id}/view`, { method: "POST" });
    } catch {}
  };

  useEffect(() => {
    if (currentStory && !currentStory.viewed) markViewed();
  }, [currentStory]);

  if (!currentUser || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div
        className="relative w-full max-w-[420px] h-full max-h-[740px] bg-black"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute top-0 left-0 right-0 z-20 p-3 flex flex-col gap-2">
          <div className="flex gap-1">
            {currentUser.stories.map((s, i) => (
              <div
                key={s.id}
                className="h-0.5 flex-1 rounded-full bg-white/40 overflow-hidden"
              >
                <div
                  className={cn(
                    "h-full bg-white transition-all",
                    i < storyIdx && "w-full",
                    i === storyIdx && "rounded-full",
                    i > storyIdx && "w-0",
                  )}
                  style={i === storyIdx ? { width: `${progress}%` } : undefined}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Avatar
              src={currentUser.avatarUrl}
              alt={currentUser.username}
              size="sm"
            />
            <span className="text-sm font-semibold text-white">
              {currentUser.username}
            </span>
            <span className="text-xs text-white/60">
              {new Date(currentStory.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <div className="flex-1" />
            <button onClick={onClose} aria-label="Close" className="p-1">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={currentStory.mediaUrl}
            alt=""
            fill
            className="object-contain"
            sizes="420px"
            priority
          />
        </div>

        {currentStory.caption && (
          <div className="absolute bottom-20 left-0 right-0 px-4 text-center">
            <p className="text-sm text-white/80">{currentStory.caption}</p>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 px-4 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Like"
            >
              <Heart className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Send via DM"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex gap-2">
            {["❤️", "😂", "😮", "😢", "😡", "🔥"].map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="text-xl hover:scale-125 transition-transform"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
