"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import { apiFetch } from "@/lib/api-client";
import { Search, Loader2, X } from "lucide-react";

interface Friend {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
}

export default function CloseFriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Friend[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    apiFetch<{ users: Friend[] }>("/settings/close-friends")
      .then((data) => setFriends(data.users))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    apiFetch<{ users: Friend[] }>(
      `/search?q=${encodeURIComponent(search)}&type=users&__dev=1`,
    )
      .then((data) => setResults(data.users))
      .finally(() => setSearching(false));
  }, [search]);

  const addFriend = async (userId: string) => {
    await apiFetch("/settings/close-friends", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    const f = results.find((r) => r.id === userId);
    if (f) setFriends((prev) => [...prev, f]);
  };

  const removeFriend = async (userId: string) => {
    await apiFetch(`/settings/close-friends/${userId}`, { method: "DELETE" });
    setFriends((prev) => prev.filter((f) => f.id !== userId));
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Close friends</h1>
      <p className="text-sm text-[var(--ig-text-secondary)] mb-4">
        Only your close friends will see stories marked with the green circle
      </p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ig-text-secondary)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full rounded bg-[var(--ig-bg-tertiary)] pl-9 pr-3 py-2 text-sm outline-none"
        />
      </div>

      {search && (
        <div className="mb-4 border border-[var(--ig-border)] rounded max-h-40 overflow-y-auto">
          {searching ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <p className="text-sm text-center py-3 text-[var(--ig-text-secondary)]">
              No results
            </p>
          ) : (
            results.map((u) => (
              <button
                key={u.id}
                onClick={() => addFriend(u.id)}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-[var(--ig-bg-tertiary)] text-sm text-left"
              >
                <Avatar src={u.avatarUrl} alt={u.username} size="sm" />
                <span className="font-semibold">{u.username}</span>
                <span className="text-xs text-[var(--ig-text-secondary)] ml-auto">
                  Add
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : friends.length === 0 ? (
        <p className="text-sm text-[var(--ig-text-secondary)] py-8 text-center">
          No close friends yet
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {friends.map((f) => (
            <div key={f.id} className="flex items-center gap-3 px-2 py-2">
              <Avatar src={f.avatarUrl} alt={f.username} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{f.username}</p>
                {f.name && (
                  <p className="text-xs text-[var(--ig-text-secondary)]">
                    {f.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeFriend(f.id)}
                className="p-1"
                aria-label="Remove"
              >
                <X className="w-4 h-4 text-[var(--ig-text-secondary)]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
