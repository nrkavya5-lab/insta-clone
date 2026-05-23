"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import { apiFetch } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

interface Blocked {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
}

export default function BlockedPage() {
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ users: Blocked[] }>("/settings/blocked")
      .then((data) => setBlocked(data.users))
      .finally(() => setLoading(false));
  }, []);

  const unblock = async (userId: string) => {
    await apiFetch(`/settings/blocked/${userId}`, { method: "DELETE" });
    setBlocked((prev) => prev.filter((b) => b.id !== userId));
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Blocked users</h1>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : blocked.length === 0 ? (
        <p className="text-sm text-[var(--ig-text-secondary)] py-8 text-center">
          No blocked users
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {blocked.map((b) => (
            <div key={b.id} className="flex items-center gap-3 px-2 py-2">
              <Avatar src={b.avatarUrl} alt={b.username} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{b.username}</p>
                {b.name && (
                  <p className="text-xs text-[var(--ig-text-secondary)]">
                    {b.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => unblock(b.id)}
                className="text-sm font-semibold text-[#0095F6] hover:text-[#00376B]"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
