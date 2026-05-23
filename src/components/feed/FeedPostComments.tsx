"use client";

interface FeedPostCommentsProps {
  commentCount: number;
  previewComment?: { username: string; text: string } | null;
}

export default function FeedPostComments({
  commentCount,
  previewComment,
}: FeedPostCommentsProps) {
  if (commentCount === 0 && !previewComment) return null;

  return (
    <div className="px-4 py-1">
      {commentCount > 0 && (
        <button className="text-sm text-[var(--ig-text-secondary)] mb-1 hover:text-[var(--ig-text-primary)] transition-colors font-medium">
          View all {commentCount} comments
        </button>
      )}
      {previewComment && (
        <p className="text-sm leading-relaxed">
          <span className="font-bold mr-1.5">{previewComment.username}</span>
          {previewComment.text}
        </p>
      )}
    </div>
  );
}
