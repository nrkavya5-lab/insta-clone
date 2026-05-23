"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Shield, ShieldOff, BadgeCheck } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  isBanned: boolean;
  postCount: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = search ? `?q=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/admin/users${params}`);
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const action = async (id: string, endpoint: string) => {
    await fetch(endpoint, { method: "POST" });
    fetchUsers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ig-text-secondary)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded bg-[var(--ig-bg-tertiary)] pl-9 pr-3 py-2 text-sm outline-none focus:bg-[var(--ig-bg-primary)] focus:border focus:border-[var(--ig-border-focus)]"
        />
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="rounded border border-[var(--ig-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--ig-bg-tertiary)] text-left">
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Posts</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-[var(--ig-border)] hover:bg-[var(--ig-bg-tertiary)]/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={u.avatarUrl} alt={u.username} size="sm" />
                      <div>
                        <p className="font-semibold">{u.username}</p>
                        <p className="text-xs text-[var(--ig-text-secondary)]">
                          {u.name ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--ig-text-secondary)]">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">{u.postCount}</td>
                  <td className="px-4 py-3">
                    {u.isBanned ? (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold">
                        Banned
                      </span>
                    ) : u.isVerified ? (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          action(u.id, `/api/admin/users/${u.id}/verify`)
                        }
                      >
                        <BadgeCheck className="w-3.5 h-3.5" />
                      </Button>
                      {u.isBanned ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            action(u.id, `/api/admin/users/${u.id}/unban`)
                          }
                        >
                          <ShieldOff className="w-3.5 h-3.5" />
                          Unban
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            action(u.id, `/api/admin/users/${u.id}/ban`)
                          }
                        >
                          <Shield className="w-3.5 h-3.5" />
                          Ban
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-[var(--ig-text-secondary)] text-sm"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
