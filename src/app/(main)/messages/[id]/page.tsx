"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import ConversationList from "@/components/messages/ConversationList";
import ChatView from "@/components/messages/ChatView";
import MessageInput from "@/components/messages/MessageInput";
import { apiFetch } from "@/lib/api-client";
import { ArrowLeft, MoreHorizontal, Phone, Video, Search } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

interface ConversationSummary {
  id: string;
  username: string;
  avatarUrl: string | null;
  participants: string;
}

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const conversationId = params.id;
  const [conversation, setConversation] = useState<ConversationSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ conversations: ConversationSummary[] }>("/messages/conversations?__dev=1")
      .then((data) => {
        const c = data.conversations.find((c) => c.id === conversationId);
        setConversation(c ?? null);
      })
      .finally(() => setLoading(false));
  }, [conversationId]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!session?.user?.id) return;
      try {
        await apiFetch(`/messages/conversations/${conversationId}/messages?__dev=1`, {
          method: "POST",
          body: JSON.stringify({ text }),
        });
      } catch {}
    },
    [conversationId, session?.user?.id],
  );

  return (
    <div
      className="flex h-[calc(100dvh-44px)] md:h-[calc(100dvh-0px)] -mx-4 md:-mx-0"
      style={{ maxWidth: "100vw", width: "100vw" }}
    >
      <div className="hidden md:flex md:w-[380px] flex-col border-r border-[var(--ig-border)] bg-[var(--ig-bg-primary)] flex-shrink-0">
        <div className="px-4 py-3.5 border-b border-[var(--ig-border)] flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold gradient-text">
              {session?.user?.name ?? "Inbox"}
            </h1>
            <p className="text-[10px] text-[var(--ig-text-secondary)] mt-0.5">
              {conversation?.username ?? "Select a chat"}
            </p>
          </div>
        </div>
        <ConversationList activeId={conversationId} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--ig-bg-primary)]">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--ig-border)] bg-[var(--ig-bg-primary)] flex-shrink-0">
          <button
            onClick={() => router.push("/messages")}
            className="md:hidden p-1.5 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative">
              <Avatar
                src={conversation?.avatarUrl}
                alt={conversation?.username ?? "U"}
                size="sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00c853] border-2 border-[var(--ig-bg-primary)] rounded-full" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-bold truncate block">
                {conversation?.username ?? "Conversation"}
              </span>
              <span className="text-[10px] text-[#00c853] font-medium">Active now</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
              aria-label="Voice call"
            >
              <Phone className="w-4 h-4 text-[var(--ig-text-secondary)]" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
              aria-label="Video call"
            >
              <Video className="w-4 h-4 text-[var(--ig-text-secondary)]" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
              aria-label="Search in conversation"
            >
              <Search className="w-4 h-4 text-[var(--ig-text-secondary)]" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="w-4 h-4 text-[var(--ig-text-secondary)]" />
            </button>
          </div>
        </div>
        <ChatView
          conversationId={conversationId}
          currentUserId={session?.user?.id ?? ""}
        />
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
