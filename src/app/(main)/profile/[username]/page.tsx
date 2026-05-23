"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfo from "@/components/profile/ProfileInfo";
import HighlightsBar from "@/components/profile/HighlightsBar";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGrid from "@/components/profile/ProfileGrid";
import FollowersModal from "@/components/profile/FollowersModal";
import FollowingModal from "@/components/profile/FollowingModal";

interface ProfileData {
  user: {
    id: string;
    username: string;
    name: string | null;
    bio: string | null;
    website: string | null;
    avatarUrl: string | null;
    isPrivate: boolean;
    isVerified: boolean;
    postCount: number;
    followerCount: number;
    followingCount: number;
  };
  relation: "self" | "following" | "none" | "pending";
  posts: Array<{
    id: string;
    mediaUrls: string[];
    mediaType: string;
    likeCount: number;
    commentCount: number;
  }>;
}

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch<ProfileData>(`/users/${params.username}/profile?__dev=1`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.username]);

  if (loading) {
    return (
      <div className="animate-pulse px-4 md:px-0">
        <div className="flex items-start gap-6 md:gap-8 mb-6">
          <div className="w-24 h-24 md:w-24 md:h-24 rounded-full bg-[var(--ig-bg-tertiary)]" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-32 bg-[var(--ig-bg-tertiary)] rounded" />
            <div className="flex gap-6">
              <div className="h-4 w-16 bg-[var(--ig-bg-tertiary)] rounded" />
              <div className="h-4 w-20 bg-[var(--ig-bg-tertiary)] rounded" />
              <div className="h-4 w-20 bg-[var(--ig-bg-tertiary)] rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[var(--ig-bg-tertiary)]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--ig-text-secondary)]">
        <p className="text-2xl font-light">User not found</p>
        <p className="text-sm mt-2">This account doesn&apost exist.</p>
      </div>
    );
  }

  const { user, relation, posts } = data;

  return (
    <div>
      <ProfileHeader
        user={user}
        relation={relation}
        onRelationChange={(r) =>
          setData((prev) => (prev ? { ...prev, relation: r } : prev))
        }
      />
      <ProfileInfo
        postCount={user.postCount}
        followerCount={user.followerCount}
        followingCount={user.followingCount}
        onFollowersClick={() => setShowFollowers(true)}
        onFollowingClick={() => setShowFollowing(true)}
      />
      <HighlightsBar />
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showSaved={relation === "self"}
      />
      {activeTab === "posts" && <ProfileGrid posts={posts} loading={loading} />}
      {activeTab === "saved" && relation === "self" && (
        <ProfileGrid posts={posts} emptyMessage="No saved posts yet" />
      )}
      {activeTab === "tagged" && (
        <ProfileGrid posts={[]} emptyMessage="No tagged posts" />
      )}
      {activeTab === "reels" && (
        <ProfileGrid posts={[]} emptyMessage="No reels yet" />
      )}

      <FollowersModal
        open={showFollowers}
        onClose={() => setShowFollowers(false)}
        userId={user.id}
      />
      <FollowingModal
        open={showFollowing}
        onClose={() => setShowFollowing(false)}
        userId={user.id}
      />
    </div>
  );
}
