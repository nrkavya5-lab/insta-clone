"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Image as ImageIcon, Smile, Mic } from "lucide-react";

interface MessageInputProps {
  onSend: (text: string, mediaUrl?: string) => void;
}

const quickEmojis = ["❤️", "😂", "🔥", "😍", "👏", "🎉", "🙏", "💀", "✨", "🥺"];

export default function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!text.trim()) return;
      onSend(text.trim());
      setText("");
    },
    [text, onSend],
  );

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-[var(--ig-border)] bg-[var(--ig-bg-primary)]">
      {showEmojis && (
        <div className="px-4 py-2 border-b border-[var(--ig-border)] bg-[var(--ig-bg-secondary)] animate-slide-up">
          <div className="flex flex-wrap gap-1.5">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="text-lg hover:scale-125 transition-transform p-1 rounded-md hover:bg-[var(--ig-bg-quaternary)]"
                aria-label={`Insert ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1.5 px-3 py-2.5"
      >
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="p-2 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
          aria-label="Toggle emoji picker"
        >
          <Smile className="w-5 h-5 text-[var(--ig-text-secondary)]" />
        </button>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
          aria-label="Attach media"
        >
          <ImageIcon className="w-5 h-5 text-[var(--ig-text-secondary)]" />
        </button>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message..."
            className="w-full rounded-full bg-[var(--ig-bg-tertiary)] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3797f0]/30 transition-shadow"
          />
        </div>
        {text.trim() ? (
          <button
            type="submit"
            className="p-2 rounded-full bg-gradient-to-r from-[#3797f0] to-[#405de6] text-white hover:shadow-lg hover:shadow-[#3797f0]/30 transition-all active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            className="p-2 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
            aria-label="Voice message"
          >
            <Mic className="w-5 h-5 text-[var(--ig-text-secondary)]" />
          </button>
        )}
      </form>
    </div>
  );
}
