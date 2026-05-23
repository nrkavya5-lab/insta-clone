"use client";

import { useState, useEffect } from "react";
import StoryRing from "@/components/feed/StoryRing";
import StoryViewer from "@/components/stories/StoryViewer";
import CreateStory from "@/components/stories/CreateStory";
import { apiFetch } from "@/lib/api-client";
import { Plus } from "lucide-react";

interface StoryUserData {
  id: string;
  username: string;
  avatarUrl: string | null;
  stories: Array<{
    id: string;
    mediaUrl: string;
    mediaType: string;
    caption?: string;
    viewed: boolean;
    createdAt: string;
  }>;
}

interface StoriesResponse {
  users: StoryUserData[];
}

export default function StoriesBar() {
  const [users, setUsers] = useState<
    Array<{
      id: string;
      username: string;
      avatarUrl: string | null;
      hasStory: boolean;
    }>
  >([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [startIdx, setStartIdx] = useState(0);
  const [storyData, setStoryData] = useState<StoryUserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<StoriesResponse>("/stories?__dev=1")
      .then((data) => {
        setUsers(
          data.users.map((u) => ({
            id: u.id,
            username: u.username,
            avatarUrl: u.avatarUrl,
            hasStory: u.stories.length > 0,
          })),
        );
        setStoryData(data.users);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openViewer = (idx: number) => {
    setStartIdx(idx);
    setViewerOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto border-b border-[var(--ig-border)] scrollbar-hide">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 flex-shrink-0 w-[68px]"
          >
            <div className="w-[56px] h-[56px] rounded-full bg-gradient-to-br from-[#405de6]/30 to-[#e1306c]/30 animate-pulse p-[3px]">
              <div className="w-full h-full rounded-full bg-[var(--ig-bg-primary)]" />
            </div>
            <div className="w-12 h-2 bg-[var(--ig-bg-tertiary)] rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto border-b border-[var(--ig-border)] scrollbar-hide">
        <button
          onClick={() => setCreateOpen(true)}
          className="flex flex-col items-center gap-1 flex-shrink-0 w-[68px] relative group"
        >
          <div className="relative">
            <div className="w-[56px] h-[56px] rounded-full bg-gradient-to-br from-[#833ab4] to-[#e1306c] flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#833ab4]/30 transition-all">
              <div className="w-[52px] h-[52px] rounded-full bg-[var(--ig-bg-primary)] flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#405de6] to-[#e1306c] flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-[var(--ig-text-secondary)] truncate w-full text-center font-medium">
            Your story
          </span>
        </button>
        {users.map((u, i) => (
          <StoryRing
            key={u.id}
            username={u.username}
            avatarUrl={u.avatarUrl}
            hasStory={u.hasStory}
            onClick={() => openViewer(i)}
          />
        ))}
      </div>

      {viewerOpen && storyData.length > 0 && (
        <StoryViewer
          users={storyData}
          initialIndex={startIdx}
          onClose={() => setViewerOpen(false)}
        />
      )}

      {createOpen && (
        <CreateStory
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            apiFetch<StoriesResponse>("/stories?__dev=1").then((data) => {
              setUsers(
                data.users.map((u) => ({
                  id: u.id,
                  username: u.username,
                  avatarUrl: u.avatarUrl,
                  hasStory: u.stories.length > 0,
                })),
              );
              setStoryData(data.users);
            });
          }}
        />
      )}
    </>
  );
}
