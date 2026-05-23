"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

interface ConversationItemProps {
  conversation: Conversation;
  active?: boolean;
}

function getTimeLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = now - date.getTime();
  if (diff < 60000) return "Now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const avatarColors = ["#405de6", "#833ab4", "#e1306c", "#f56040", "#fcaf45", "#00c853", "#3797f0", "#fd1d1d"];

export default function ConversationItem({ conversation, active }: ConversationItemProps) {
  const avatarColor = avatarColors[conversation.username.charCodeAt(0) % avatarColors.length];

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-all duration-200 border-b border-[var(--ig-border)]",
        active
          ? "bg-gradient-to-r from-[#405de6]/5 to-[#e1306c]/5 border-l-2 border-l-[#405de6]"
          : "hover:bg-[var(--ig-bg-tertiary)]",
      )}
    >
      <div className="relative flex-shrink-0">
        <div className={cn("w-12 h-12 rounded-full overflow-hidden ring-2 ring-offset-1 shadow-sm", active ? "ring-[#405de6]" : "ring-transparent")}>
          {conversation.avatarUrl ? (
            <Image
              src={conversation.avatarUrl}
              alt=""
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}dd)` }}
            >
              {conversation.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {conversation.online && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#00c853] border-2 border-[var(--ig-bg-primary)] rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("text-sm truncate", conversation.unread ? "font-bold" : "font-semibold")}>
            {conversation.username}
          </span>
          <span className="text-[10px] text-[var(--ig-text-secondary)] flex-shrink-0">
            {getTimeLabel(conversation.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {conversation.isGroup && (
            <span className="text-[10px] text-[var(--ig-text-secondary)]">👥</span>
          )}
          <p
            className={cn(
              "text-sm truncate flex-1",
              conversation.unread ? "text-[var(--ig-text-primary)] font-semibold" : "text-[var(--ig-text-secondary)]",
            )}
          >
            {conversation.lastMessage ?? "No messages yet"}
          </p>
          {conversation.unread && (
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#405de6] to-[#e1306c] flex-shrink-0" />
          )}
        </div>
      </div>
    </Link>
  );
}
