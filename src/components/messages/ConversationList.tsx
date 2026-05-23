"use client";

import { useEffect, useState, useCallback } from "react";
import ConversationItem from "./ConversationItem";
import { apiFetch } from "@/lib/api-client";
import { Loader2, MessageSquarePlus, Search } from "lucide-react";
import Link from "next/link";

interface Conversation {
  id: string;
  username: string;
  avatarUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unread: boolean;
  isGroup: boolean;
  participants: string;
  online?: boolean;
}

interface ConversationListProps {
  activeId?: string;
}

export default function ConversationList({ activeId }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    apiFetch<{ conversations: Conversation[] }>("/messages/conversations?__dev=1")
      .then((data) =>
        setConversations(
          data.conversations.map((c, i) => ({ ...c, online: i === 0 })),
        ),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = searchQuery
    ? conversations.filter((c) =>
        c.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  const unreadCount = conversations.filter((c) => c.unread).length;

  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-[var(--ig-bg-tertiary)]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-[var(--ig-bg-tertiary)] rounded" />
              <div className="h-2.5 w-40 bg-[var(--ig-bg-tertiary)] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ig-text-secondary)]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full rounded-lg bg-[var(--ig-bg-tertiary)] pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#3797f0]/30 transition-shadow"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#405de6] to-[#e1306c] flex items-center justify-center text-xl mb-3 shadow-md">💭</div>
            <p className="text-sm font-semibold text-[var(--ig-text-primary)]">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </p>
            <p className="text-xs text-[var(--ig-text-secondary)] mt-1">
              {searchQuery ? "Try a different name" : "Start a new conversation"}
            </p>
          </div>
        ) : (
          <div>
            {unreadCount > 0 && (
              <div className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex-1 h-px bg-gradient-to-r from-[#405de6]/30 to-transparent" />
                  <span className="text-[10px] font-semibold text-[var(--ig-text-secondary)] uppercase tracking-wider">
                    Unread ({unreadCount})
                  </span>
                  <span className="flex-1 h-px bg-gradient-to-l from-[#e1306c]/30 to-transparent" />
                </div>
              </div>
            )}
            {filtered.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={c.id === activeId}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-3 border-t border-[var(--ig-border)]">
        <Link
          href="/search"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-gradient-to-r from-[#405de6] to-[#e1306c] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#405de6]/20 transition-all active:scale-[0.98]"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New message
        </Link>
      </div>
    </div>
  );
}
