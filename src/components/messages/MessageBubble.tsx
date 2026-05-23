"use client";

import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  text: string | null;
  mediaUrl?: string | null;
  sent: boolean;
  createdAt: string;
  read?: boolean;
}

const reactions = ["❤️", "😂", "😮", "😢", "🙏"];

export default function MessageBubble({ text, mediaUrl, sent, createdAt, read }: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={cn("flex mb-2 group", sent ? "justify-end" : "justify-start")}>
      <div className="relative max-w-[80%]">
        {mediaUrl && (
          <div className="relative overflow-hidden rounded-2xl mb-1">
            <img
              src={mediaUrl}
              alt="Shared media"
              className="w-full max-h-64 object-cover"
              style={{ minHeight: "120px" }}
            />
            <button
              className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1.5 hover:bg-black/70 transition-colors"
              aria-label="Download media"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        )}
        <div
          className={cn(
            "relative px-3.5 py-2.5 text-sm shadow-sm",
            sent
              ? "bg-[var(--ig-message-sent)] text-white rounded-[18px] rounded-br-[4px]"
              : "bg-[var(--ig-bg-tertiary)] text-[var(--ig-text-primary)] rounded-[18px] rounded-bl-[4px]",
          )}
        >
          {text && (
            <p className="whitespace-pre-wrap break-words leading-relaxed">
              {text}
            </p>
          )}
          <div className={cn("flex items-center gap-1 mt-1", sent ? "justify-end" : "justify-start")}>
            <span className={cn("text-[10px]", sent ? "text-white/70" : "text-[var(--ig-text-secondary)]")}>
              {time}
            </span>
            {sent && (
              read ? (
                <CheckCheck className="w-3 h-3 text-[#53d769]" />
              ) : (
                <Check className="w-3 h-3 text-white/60" />
              )
            )}
          </div>
        </div>
        <div
          className={cn(
            "absolute -bottom-4 hidden group-hover:flex items-center gap-0.5 bg-[var(--ig-bg-primary)] border border-[var(--ig-border)] rounded-full px-2 py-1 shadow-md z-10",
            sent ? "left-0" : "right-0",
          )}
        >
          {reactions.map((emoji) => (
            <button
              key={emoji}
              className="text-xs hover:scale-125 transition-transform p-0.5"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
