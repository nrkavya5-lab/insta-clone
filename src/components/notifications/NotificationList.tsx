"use client";

import { useState, useEffect, useCallback } from "react";
import NotificationItem from "./NotificationItem";
import { apiFetch } from "@/lib/api-client";
import { Loader2, Bell } from "lucide-react";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "follow_request" | "mention" | "reply";
  actorUsername: string;
  actorAvatarUrl: string | null;
  text: string;
  createdAt: string;
  isRead: boolean;
  postId: string | null;
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetch = useCallback(async (c?: string | null) => {
    const params = new URLSearchParams({ limit: "20" });
    if (c) params.set("cursor", c);
    return apiFetch<{
      notifications: Notification[];
      nextCursor: string | null;
    }>(`/notifications?__dev=1&${params}`);
  }, []);

  useEffect(() => {
    fetch(null)
      .then((data) => {
        setNotifications(data.notifications);
        setCursor(data.nextCursor);
      })
      .finally(() => setLoading(false));
  }, [fetch]);

  const loadMore = async () => {
    if (loadingMore || !cursor) return;
    setLoadingMore(true);
    const data = await fetch(cursor);
    setNotifications((prev) => [...prev, ...data.notifications]);
    setCursor(data.nextCursor);
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#405de6]/30 to-[#e1306c]/30" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-48 bg-[var(--ig-bg-tertiary)] rounded" />
              <div className="h-2.5 w-16 bg-[var(--ig-bg-tertiary)] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#405de6]/10 to-[#e1306c]/10 flex items-center justify-center mb-4">
            <Bell className="w-7 h-7 text-[#405de6]" />
          </div>
          <p className="text-sm font-semibold text-[var(--ig-text-primary)]">
            No notifications yet
          </p>
          <p className="text-xs text-[var(--ig-text-secondary)] mt-1">
            When someone likes or comments, it'll show up here
          </p>
        </div>
      ) : (
        notifications.map((n) => <NotificationItem key={n.id} {...n} />)
      )}
      {cursor && (
        <div className="flex justify-center py-5">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#405de6]/10 to-[#e1306c]/10 text-sm font-semibold text-[#405de6] hover:from-[#405de6]/20 hover:to-[#e1306c]/20 transition-all disabled:opacity-50"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
