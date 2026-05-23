import Avatar from "@/components/ui/Avatar";
import FollowButton from "./FollowButton";

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    name: string | null;
    bio: string | null;
    website: string | null;
    avatarUrl: string | null;
    isPrivate: boolean;
    isVerified: boolean;
  };
  relation: "self" | "following" | "none" | "pending";
  onRelationChange?: (r: "none" | "following" | "pending") => void;
}

export default function ProfileHeader({
  user,
  relation,
  onRelationChange,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-start gap-6 md:gap-8 px-4 md:px-0 mb-6">
      <Avatar
        src={user.avatarUrl}
        alt={user.username}
        size="xl"
        className="flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <h1 className="text-xl font-light truncate">{user.username}</h1>
          {user.isVerified && (
            <span className="text-[#0095F6]" aria-label="Verified">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </span>
          )}
          {relation !== "self" && (
            <FollowButton
              userId={user.id}
              initialStatus={
                relation === "following"
                  ? "following"
                  : relation === "pending"
                    ? "pending"
                    : "none"
              }
              onStatusChange={onRelationChange}
            />
          )}
          {relation === "self" && (
            <a
              href="/settings/edit"
              className="text-sm font-semibold border border-[var(--ig-border)] rounded px-4 py-1.5 hover:bg-[var(--ig-bg-tertiary)] transition-colors"
            >
              Edit profile
            </a>
          )}
        </div>
        <div className="flex gap-6 mb-3">
          <span className="text-sm">
            <strong>0</strong> posts
          </span>
          <span className="text-sm">
            <strong>0</strong> followers
          </span>
          <span className="text-sm">
            <strong>0</strong> following
          </span>
        </div>
        {user.name && <p className="text-sm font-semibold">{user.name}</p>}
        {user.bio && <p className="text-sm whitespace-pre-line">{user.bio}</p>}
        {user.website && (
          <a
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#00376B] dark:text-[#E0F1FF] hover:underline"
          >
            {user.website}
          </a>
        )}
      </div>
    </div>
  );
}
