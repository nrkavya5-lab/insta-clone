"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import FollowButton from "@/components/profile/FollowButton";
import { apiFetch } from "@/lib/api-client";
import { Search, Loader2 } from "lucide-react";

interface User {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
  isVerified: boolean;
  relation: "self" | "following" | "none" | "pending";
  mutualFriends?: number;
}

interface FollowersModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  title?: string;
}

export default function FollowersModal({
  open,
  onClose,
  userId,
  title = "Followers",
}: FollowersModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    apiFetch<User[]>(`/users/${userId}/followers`)
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, userId]);

  const filtered = search
    ? users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-sm">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ig-text-secondary)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full rounded bg-[var(--ig-bg-tertiary)] pl-9 pr-3 py-2 text-sm outline-none"
        />
      </div>
      <div className="max-h-72 overflow-y-auto flex flex-col gap-1 -mx-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--ig-text-secondary)]" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-center text-[var(--ig-text-secondary)] py-8">
            {search ? "No results" : "No followers yet"}
          </p>
        ) : (
          filtered.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--ig-bg-tertiary)] transition-colors"
            >
              <Avatar src={u.avatarUrl} alt={u.username} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {u.username}
                  {u.isVerified && (
                    <span className="text-[#0095F6] ml-1 text-xs">
                      &#x2713;
                    </span>
                  )}
                </p>
                <p className="text-xs text-[var(--ig-text-secondary)] truncate">
                  {u.name ?? u.username}
                  {u.mutualFriends ? ` · ${u.mutualFriends} mutual` : ""}
                </p>
              </div>
              <FollowButton
                userId={u.id}
                initialStatus={
                  u.relation === "following"
                    ? "following"
                    : u.relation === "pending"
                      ? "pending"
                      : "none"
                }
                size="sm"
              />
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
