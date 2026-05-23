"use client";

import Avatar from "@/components/ui/Avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, UserPlus, AtSign, Reply, UserCheck } from "lucide-react";

interface NotificationItemProps {
  id: string;
  type: "like" | "comment" | "follow" | "follow_request" | "mention" | "reply";
  actorUsername: string;
  actorAvatarUrl: string | null;
  text: string;
  createdAt: string;
  isRead: boolean;
  postId?: string | null;
}

const typeConfig: Record<string, { icon: React.ReactNode; gradient: string }> = {
  like: { icon: <Heart className="w-3.5 h-3.5" fill="currentColor" />, gradient: "from-[#ed4956] to-[#fd1d1d]" },
  comment: { icon: <MessageCircle className="w-3.5 h-3.5" fill="currentColor" />, gradient: "from-[#405de6] to-[#3797f0]" },
  follow: { icon: <UserPlus className="w-3.5 h-3.5" />, gradient: "from-[#00c853] to-[#00e676]" },
  follow_request: { icon: <UserCheck className="w-3.5 h-3.5" />, gradient: "from-[#fcaf45] to-[#f56040]" },
  mention: { icon: <AtSign className="w-3.5 h-3.5" />, gradient: "from-[#833ab4] to-[#405de6]" },
  reply: { icon: <Reply className="w-3.5 h-3.5" />, gradient: "from-[#e1306c] to-[#f56040]" },
};

export default function NotificationItem({
  id,
  type,
  actorUsername,
  actorAvatarUrl,
  text,
  createdAt,
  isRead,
  postId,
}: NotificationItemProps) {
  const timeAgo = getTimeAgo(new Date(createdAt));
  const isLinkable = (postId && (type === "like" || type === "comment")) || type === "follow" || type === "follow_request";
  const cfg = typeConfig[type];

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3.5 transition-all duration-200 border-b border-[var(--ig-border)]",
        !isRead && "bg-gradient-to-r from-[#405de6]/[0.03] to-[#e1306c]/[0.03]",
        "hover:bg-[var(--ig-bg-tertiary)]",
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar src={actorAvatarUrl} alt={actorUsername} size="md" />
        <div className={cn(
          "absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-white shadow-sm",
          cfg.gradient,
        )}>
          {cfg.icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-relaxed">
          {isLinkable ? (
            <span className="font-bold">{actorUsername}</span>
          ) : (
            <Link
              href={`/profile/${actorUsername}`}
              className="font-bold hover:underline"
            >
              {actorUsername}
            </Link>
          )}{" "}
          <span className="text-[var(--ig-text-secondary)]">{text}</span>
        </p>
        <p className="text-[11px] text-[var(--ig-text-secondary)] mt-0.5 font-medium">
          {timeAgo}
        </p>
      </div>
      {!isRead && (
        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#405de6] to-[#e1306c] flex-shrink-0 mt-2 shadow-sm" />
      )}
    </div>
  );

  if (postId && (type === "like" || type === "comment")) {
    return <Link href={`/p/${postId}`}>{content}</Link>;
  }

  if (type === "follow" || type === "follow_request") {
    return <Link href={`/profile/${actorUsername}`}>{content}</Link>;
  }

  return content;
}

function getTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}
