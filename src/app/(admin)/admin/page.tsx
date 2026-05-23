"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, FileText, Flag, BarChart3 } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  pendingReports: number;
  bannedUsers: number;
  verifiedUsers: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/dashboard");
    if (res.ok) setStats(await res.json());
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const cards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: Users },
        { label: "Total Posts", value: stats.totalPosts, icon: FileText },
        {
          label: "Total Comments",
          value: stats.totalComments,
          icon: BarChart3,
        },
        { label: "Pending Reports", value: stats.pendingReports, icon: Flag },
        { label: "Banned Users", value: stats.bannedUsers, icon: Users },
        { label: "Verified Users", value: stats.verifiedUsers, icon: Users },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {!stats ? (
        <p className="text-[var(--ig-text-secondary)] text-sm">Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded bg-[var(--ig-bg-tertiary)] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[var(--ig-text-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--ig-text-secondary)] uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-xl font-bold">{value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
