"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReelCard from "@/components/reels/ReelCard";
import ReelActions from "@/components/reels/ReelActions";
import { apiFetch } from "@/lib/api-client";
import { Loader2, Music } from "lucide-react";

interface Reel {
  id: string;
  username: string;
  avatarUrl: string | null;
  mediaUrls: string[];
  caption: string;
  audioName: string;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  saved: boolean;
}

export default function ReelsFeed() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    apiFetch<{ reels: Reel[] }>("/reels?__dev=1")
      .then((data) => setReels(data.reels))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scrollTo = useCallback((index: number) => {
    if (!containerRef.current) return;
    const el = containerRef.current.children[index] as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveIdx(index);
  }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0 && activeIdx < reels.length - 1) scrollTo(activeIdx + 1);
      else if (e.deltaY < 0 && activeIdx > 0) scrollTo(activeIdx - 1);
    },
    [activeIdx, reels.length, scrollTo],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const dy = e.changedTouches[0].clientY - touchStartRef.current;
    touchStartRef.current = null;
    if (dy < -50 && activeIdx < reels.length - 1) scrollTo(activeIdx + 1);
    else if (dy > 50 && activeIdx > 0) scrollTo(activeIdx - 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(idx)) setActiveIdx(idx);
          }
        });
      },
      { threshold: 0.7 },
    );

    const children = containerRef.current?.children;
    if (children) {
      Array.from(children).forEach((child) => observer.observe(child));
    }
    return () => observer.disconnect();
  }, [reels]);

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white/60" />
          <span className="text-xs text-white/40">Loading reels...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-dvh overflow-hidden snap-y snap-mandatory bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {reels.map((reel, i) => (
        <div
          key={reel.id}
          data-index={i}
          className="h-dvh snap-start snap-always relative"
        >
          <ReelCard src={reel.mediaUrls[0]} playing={i === activeIdx} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          <div className="absolute bottom-24 left-4 right-20 z-20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-[2px] rounded-full bg-gradient-to-br from-[#fcaf45] via-[#e1306c] to-[#833ab4]">
                <div className="rounded-full bg-black p-[1px]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#405de6] to-[#833ab4] flex items-center justify-center text-xs text-white font-bold">
                    {reel.username.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              <span className="text-sm font-bold text-white">
                {reel.username}
              </span>
              <button className="text-xs font-bold text-white border border-white/60 rounded-lg px-4 py-1 hover:bg-white/10 transition-colors">
                Follow
              </button>
            </div>
            <p className="text-sm text-white/90 line-clamp-2 leading-relaxed">
              {reel.caption}
            </p>
            {reel.audioName && (
              <p className="text-xs text-white/60 mt-2 flex items-center gap-1.5">
                <Music className="w-3 h-3" />
                {reel.audioName}
              </p>
            )}
          </div>
          <div className="absolute bottom-24 right-3 z-20">
            <ReelActions
              postId={reel.id}
              liked={reel.liked}
              likeCount={reel.likeCount}
              commentCount={reel.commentCount}
              saved={reel.saved}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
