"use client";

import { useState, useEffect, useCallback } from "react";
import { Check } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

interface ReportItem {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter: { id: string; username: string; avatarUrl: string | null };
  post?: { id: string; mediaUrls: string[]; caption: string | null } | null;
  comment?: { id: string; text: string } | null;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/reports?status=${filter}`);
    if (res.ok) setReports(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const resolve = async (id: string) => {
    await fetch(`/api/admin/reports/${id}/resolve`, { method: "POST" });
    fetchReports();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Report Queue</h1>
      <div className="flex gap-2 mb-4">
        {["pending", "resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
              filter === s
                ? "bg-[#405DE6] text-white"
                : "bg-[var(--ig-bg-tertiary)] text-[var(--ig-text-primary)]"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <Spinner />
      ) : reports.length === 0 ? (
        <p className="text-sm text-[var(--ig-text-secondary)]">
          No reports found.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={r.reporter.avatarUrl}
                    alt={r.reporter.username}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {r.reporter.username}
                    </p>
                    <p className="text-xs text-[var(--ig-text-secondary)]">
                      {r.reason}
                    </p>
                  </div>
                </div>
                {r.status === "pending" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => resolve(r.id)}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Resolve
                  </Button>
                )}
              </div>
              {r.post && (
                <div className="rounded bg-[var(--ig-bg-tertiary)] p-3 text-sm">
                  <p className="font-semibold mb-1">Post:</p>
                  {r.post.caption && (
                    <p className="text-[var(--ig-text-secondary)]">
                      {r.post.caption}
                    </p>
                  )}
                  {r.post.mediaUrls[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.post.mediaUrls[0]}
                      alt=""
                      className="mt-2 w-20 h-20 object-cover rounded"
                    />
                  )}
                </div>
              )}
              {r.comment && (
                <div className="rounded bg-[var(--ig-bg-tertiary)] p-3 text-sm">
                  <p className="font-semibold mb-1">Comment:</p>
                  <p className="text-[var(--ig-text-secondary)]">
                    {r.comment.text}
                  </p>
                </div>
              )}
              <p className="text-xs text-[var(--ig-text-secondary)] mt-2">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
