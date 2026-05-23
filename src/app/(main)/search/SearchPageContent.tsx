"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import FollowButton from "@/components/profile/FollowButton";
import { apiFetch } from "@/lib/api-client";
import { Search, Hash, Loader2, Clock, Users, TrendingUp } from "lucide-react";

interface UserResult {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
  isVerified: boolean;
  relation: "self" | "following" | "none" | "pending";
}

interface HashtagResult {
  id: string;
  name: string;
  postCount: number;
}

type TabType = "all" | "users" | "hashtags";

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [tab, setTab] = useState<TabType>("all");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [hashtags, setHashtags] = useState<HashtagResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setUsers([]);
        setHashtags([]);
        return;
      }
      setLoading(true);
      try {
        const data = await apiFetch<{
          users: UserResult[];
          hashtags: HashtagResult[];
        }>(`/search?q=${encodeURIComponent(q)}&type=${tab}&__dev=1`);
        setUsers(data.users ?? []);
        setHashtags(data.hashtags ?? []);
      } catch {
        setUsers([]);
        setHashtags([]);
      } finally {
        setLoading(false);
      }
    },
    [tab],
  );

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setQuery(inputValue);
      if (inputValue.trim()) {
        const stored = JSON.parse(
          localStorage.getItem("recent-searches") ?? "[]",
        ) as string[];
        const updated = [
          inputValue,
          ...stored.filter((s) => s !== inputValue),
        ].slice(0, 10);
        localStorage.setItem("recent-searches", JSON.stringify(updated));
        setRecent(updated);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  useEffect(() => {
    doSearch(query);
  }, [query, doSearch]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("recent-searches") ?? "[]",
    ) as string[];
    setRecent(stored);
  }, []);

  const clearRecent = () => {
    localStorage.removeItem("recent-searches");
    setRecent([]);
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All", icon: <Search className="w-3.5 h-3.5" /> },
    { key: "users", label: "Users", icon: <Users className="w-3.5 h-3.5" /> },
    { key: "hashtags", label: "Hashtags", icon: <Hash className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="px-4 md:px-0 animate-fade-in">
      <h1 className="text-lg font-bold gradient-text mb-4">Search</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ig-text-secondary)]" />
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search people, hashtags..."
          className="w-full rounded-xl bg-[var(--ig-bg-tertiary)] pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-[var(--ig-bg-primary)] focus:ring-2 focus:ring-[#405de6]/20 focus:border-[#405de6]/30 transition-all border border-transparent"
        />
      </div>

      <div className="flex gap-1 mb-4 p-1 rounded-xl bg-[var(--ig-bg-tertiary)]">
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              tab === key
                ? "bg-[var(--ig-bg-primary)] text-[var(--ig-text-primary)] shadow-sm"
                : "text-[var(--ig-text-secondary)] hover:text-[var(--ig-text-primary)]"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {!query && recent.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--ig-text-secondary)]" />
              Recent searches
            </h2>
            <button
              onClick={clearRecent}
              className="text-xs font-semibold text-[#405de6] hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {recent.map((r) => (
              <button
                key={r}
                onClick={() => setInputValue(r)}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--ig-bg-tertiary)] rounded-xl transition-colors text-sm text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#405de6]/10 to-[#e1306c]/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[var(--ig-text-secondary)]" />
                </div>
                <span className="font-medium">{r}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!query && recent.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#405de6]/10 to-[#e1306c]/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-7 h-7 text-[#405de6]" />
          </div>
          <p className="text-sm font-semibold text-[var(--ig-text-primary)]">
            Discover people and hashtags
          </p>
          <p className="text-xs text-[var(--ig-text-secondary)] mt-1">
            Search for your friends or trending topics
          </p>
        </div>
      )}

      {loading && (
        <div className="space-y-2 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#405de6]/30 to-[#e1306c]/30" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-[var(--ig-bg-tertiary)] rounded" />
                <div className="h-2.5 w-20 bg-[var(--ig-bg-tertiary)] rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (tab === "all" || tab === "users") && users.length > 0 && (
        <div className="flex flex-col gap-1">
          {tab === "all" && (
            <h3 className="text-xs font-semibold text-[var(--ig-text-secondary)] uppercase tracking-wider px-3 mb-1">
              Users
            </h3>
          )}
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--ig-bg-tertiary)] rounded-xl transition-all"
            >
              <Link
                href={`/profile/${u.username}`}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <div className="p-[1.5px] rounded-full bg-gradient-to-br from-[#405de6] to-[#e1306c]">
                  <div className="rounded-full bg-[var(--ig-bg-primary)] p-[1.5px]">
                    <Avatar src={u.avatarUrl} alt={u.username} size="sm" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate flex items-center gap-1">
                    {u.username}
                    {u.isVerified && (
                      <span className="text-[#405de6] text-xs">✓</span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--ig-text-secondary)] truncate">
                    {u.name ?? u.username}
                  </p>
                </div>
              </Link>
              <FollowButton
                userId={u.id}
                initialStatus={u.relation}
                size="sm"
              />
            </div>
          ))}
        </div>
      )}

      {!loading &&
        (tab === "all" || tab === "hashtags") &&
        hashtags.length > 0 && (
          <div className="mt-4">
            {tab === "all" && (
              <h3 className="text-xs font-semibold text-[var(--ig-text-secondary)] uppercase tracking-wider px-3 mb-1">
                Hashtags
              </h3>
            )}
            {hashtags.map((h) => (
              <Link
                key={h.id}
                href={`/explore?tag=${h.name}`}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--ig-bg-tertiary)] rounded-xl transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#405de6]/10 to-[#e1306c]/10 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-[#405de6]" />
                </div>
                <div>
                  <p className="text-sm font-bold">#{h.name}</p>
                  <p className="text-xs text-[var(--ig-text-secondary)]">
                    {h.postCount.toLocaleString()} posts
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      {!loading && query && users.length === 0 && hashtags.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#405de6]/10 to-[#e1306c]/10 flex items-center justify-center mb-3">
            <Search className="w-6 h-6 text-[var(--ig-text-secondary)]" />
          </div>
          <p className="text-sm font-semibold">
            No results for &quot;{query}&quot;
          </p>
          <p className="text-xs text-[var(--ig-text-secondary)] mt-1">
            Try a different search term
          </p>
        </div>
      )}
    </div>
  );
}
