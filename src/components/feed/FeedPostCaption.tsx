"use client";

interface FeedPostCaptionProps {
  username: string;
  caption: string;
}

export default function FeedPostCaption({
  username,
  caption,
}: FeedPostCaptionProps) {
  const parts = caption.split(/(#\w+|@\w+)/g);

  return (
    <div className="px-4 py-1">
      <p className="text-sm leading-relaxed">
        <span className="font-bold mr-1.5">{username}</span>
        {parts.map((part, i) => {
          if (part.startsWith("#")) {
            return (
              <span
                key={i}
                className="text-[#00376b] dark:text-[#70c5ff] cursor-pointer hover:underline font-medium"
              >
                {part}
              </span>
            );
          }
          if (part.startsWith("@")) {
            return (
              <span
                key={i}
                className="text-[#00376b] dark:text-[#70c5ff] cursor-pointer hover:underline"
              >
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    </div>
  );
}
