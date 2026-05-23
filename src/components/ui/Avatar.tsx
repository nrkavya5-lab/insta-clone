import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  hasStory?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 96,
};

const ringClass = "ring-2 ring-offset-2 ring-offset-[var(--ig-bg-primary)]";

export default function Avatar({
  src,
  alt = "",
  size = "md",
  hasStory,
  className,
}: AvatarProps) {
  const px = sizeMap[size];
  const storyRing = hasStory
    ? "bg-gradient-to-tr from-[#FCAF45] via-[#E1306C] to-[#833AB4] p-[2px]"
    : "";

  return (
    <div
      className={cn("inline-flex rounded-full", storyRing, className)}
      style={{ width: px + 4, height: px + 4 }}
    >
      <div
        className="rounded-full overflow-hidden flex-shrink-0"
        style={{ width: px, height: px }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={px}
            height={px}
            className={cn("object-cover w-full h-full", hasStory && ringClass)}
          />
        ) : (
          <div
            className={cn(
              "w-full h-full bg-[var(--ig-bg-tertiary)] flex items-center justify-center text-[var(--ig-text-secondary)] font-semibold",
              hasStory && ringClass,
            )}
            style={{ fontSize: px * 0.4 }}
          >
            {alt.charAt(0).toUpperCase() || "?"}
          </div>
        )}
      </div>
    </div>
  );
}
