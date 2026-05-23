"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { apiFetch } from "@/lib/api-client";
import { Loader2, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  text: string | null;
  mediaUrl: string | null;
  senderId: string;
  createdAt: string;
}

interface ChatViewProps {
  conversationId: string;
  currentUserId: string;
  typingUsers?: string[];
}

function DateSeparator({ date }: { date: string }) {
  const msgDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  let label: string;
  if (msgDate.toDateString() === today.toDateString()) label = "Today";
  else if (msgDate.toDateString() === yesterday.toDateString()) label = "Yesterday";
  else label = msgDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: msgDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined });

  const isToday = label === "Today";

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--ig-border)] to-transparent" />
      <span className={cn("text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0", isToday ? "bg-gradient-to-r from-[#405de6] to-[#e1306c] text-white" : "bg-[var(--ig-bg-tertiary)] text-[var(--ig-text-secondary)]")}>
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--ig-border)] to-transparent" />
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ChatView({ conversationId, currentUserId, typingUsers }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiFetch<{ messages: Message[] }>(`/messages/conversations/${conversationId}/messages?__dev=1`)
      .then((data) => setMessages(data.messages))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 200);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const grouped = messages.reduce<{ date: string; msgs: Message[] }[]>((acc, msg) => {
    const date = new Date(msg.createdAt).toDateString();
    const last = acc[acc.length - 1];
    if (last && last.date === date) last.msgs.push(msg);
    else acc.push({ date, msgs: [msg] });
    return acc;
  }, []);

  const lastReadId = messages.find((m) => m.senderId === currentUserId)?.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#3797f0]" />
          <span className="text-xs text-[var(--ig-text-secondary)]">Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative min-h-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 bg-gradient-to-b from-[var(--ig-bg-primary)] via-[var(--ig-bg-secondary)] to-[var(--ig-bg-primary)]"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#405de6] to-[#e1306c] flex items-center justify-center text-3xl mb-4 animate-float shadow-lg">
              💬
            </div>
            <p className="text-sm font-semibold text-[var(--ig-text-primary)]">No messages yet</p>
            <p className="text-xs text-[var(--ig-text-secondary)] mt-1">Send a message to start the conversation!</p>
          </div>
        ) : (
          grouped.map((g) => (
            <div key={g.date}>
              <DateSeparator date={g.date} />
              {g.msgs.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  text={msg.text}
                  mediaUrl={msg.mediaUrl}
                  sent={msg.senderId === currentUserId}
                  createdAt={msg.createdAt}
                  read={lastReadId === msg.id}
                />
              ))}
            </div>
          ))
        )}
        {typingUsers && typingUsers.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 bg-[var(--ig-bg-tertiary)] rounded-full px-3 py-2">
              <TypingIndicator />
              <span className="text-xs text-[var(--ig-text-secondary)] ml-1">
                {typingUsers.join(", ")} typing...
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-gradient-to-r from-[#405de6] to-[#e1306c] text-white flex items-center justify-center shadow-lg animate-pulse-glow hover:scale-110 transition-transform z-10"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
