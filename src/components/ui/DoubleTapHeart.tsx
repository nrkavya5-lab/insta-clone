"use client";

import { useState, useCallback, useRef } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface DoubleTapHeartProps {
  children: React.ReactNode;
  onDoubleTap: () => void;
  liked?: boolean;
}

export default function DoubleTapHeart({
  children,
  onDoubleTap,
  liked,
}: DoubleTapHeartProps) {
  const [showHeart, setShowHeart] = useState(false);
  const lastTapRef = useRef(0);

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
      onDoubleTap();
    }
    lastTapRef.current = now;
  }, [onDoubleTap]);

  return (
    <div className="relative" onClick={handleClick}>
      {children}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <Heart
            className={cn(
              "w-20 h-20 animate-heart-bounce",
              liked
                ? "fill-[var(--ig-like)] text-[var(--ig-like)]"
                : "fill-white text-white",
            )}
            style={{ animationDuration: "0.5s" }}
          />
        </div>
      )}
    </div>
  );
}
