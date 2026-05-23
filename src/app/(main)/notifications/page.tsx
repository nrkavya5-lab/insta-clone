"use client";

import { useState } from "react";
import NotificationList from "@/components/notifications/NotificationList";
import { apiFetch } from "@/lib/api-client";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const [readAllLoading, setReadAllLoading] = useState(false);

  const handleReadAll = async () => {
    setReadAllLoading(true);
    try {
      await apiFetch("/notifications/read-all", { method: "POST" });
    } catch {}
    setReadAllLoading(false);
  };

  return (
    <div className="px-4 md:px-0 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold gradient-text flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h1>
        <button
          onClick={handleReadAll}
          disabled={readAllLoading}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-[#405de6]/10 to-[#e1306c]/10 text-[#405de6] hover:from-[#405de6]/20 hover:to-[#e1306c]/20 transition-all"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          {readAllLoading ? "..." : "Mark all read"}
        </button>
      </div>
      <NotificationList />
    </div>
  );
}
