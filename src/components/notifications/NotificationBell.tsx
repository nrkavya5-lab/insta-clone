"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api-client";
import { Heart } from "lucide-react";

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className }: NotificationBellProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    apiFetch<{ count: number }>("/notifications/unread-count")
      .then((data) => setCount(data.count))
      .catch(() => {});
  }, []);

  return (
    <div className={cn("relative", className)}>
      <Heart className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#ED4956] text-white text-[10px] font-semibold flex items-center justify-center px-1 leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
}
