"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DoubleTapHeart from "@/components/ui/DoubleTapHeart";

interface CarouselViewerProps {
  mediaUrls: string[];
  aspectRatio?: string;
  liked?: boolean;
  onDoubleTapLike?: () => void;
}

export default function CarouselViewer({
  mediaUrls,
  aspectRatio = "1/1",
  liked,
  onDoubleTapLike,
}: CarouselViewerProps) {
  const [index, setIndex] = useState(0);
  const isMulti = mediaUrls.length > 1;

  function prev() {
    setIndex((i) => (i === 0 ? mediaUrls.length - 1 : i - 1));
  }

  function next() {
    setIndex((i) => (i === mediaUrls.length - 1 ? 0 : i + 1));
  }

  const media = (
    <div
      className="relative group overflow-hidden bg-[var(--ig-bg-tertiary)]"
      style={{ aspectRatio }}
    >
      <Image
        src={mediaUrls[index]}
        alt={`Media ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 630px"
      />
      {isMulti && (
        <>
          {index > 0 && (
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {index < mediaUrls.length - 1 && (
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {mediaUrls.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === index
                    ? "w-5 h-1.5 bg-gradient-to-r from-[#405de6] to-[#e1306c]"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (onDoubleTapLike) {
    return (
      <DoubleTapHeart onDoubleTap={onDoubleTapLike} liked={liked}>
        {media}
      </DoubleTapHeart>
    );
  }

  return media;
}
