"use client";

interface ProfileInfoProps {
  postCount: number;
  followerCount: number;
  followingCount: number;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

export default function ProfileInfo({
  postCount,
  followerCount,
  followingCount,
  onFollowersClick,
  onFollowingClick,
}: ProfileInfoProps) {
  return (
    <div className="flex gap-6 mb-3 md:hidden">
      <span className="text-sm text-center">
        <strong className="block text-base">{postCount}</strong>
        posts
      </span>
      <button
        onClick={onFollowersClick}
        className="text-sm text-center hover:opacity-70"
      >
        <strong className="block text-base">{followerCount}</strong>
        followers
      </button>
      <button
        onClick={onFollowingClick}
        className="text-sm text-center hover:opacity-70"
      >
        <strong className="block text-base">{followingCount}</strong>
        following
      </button>
    </div>
  );
}
