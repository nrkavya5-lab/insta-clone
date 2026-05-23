import Avatar from "@/components/ui/Avatar";

interface Highlight {
  id: string;
  coverUrl: string | null;
  title: string;
}

interface HighlightsBarProps {
  highlights?: Highlight[];
}

export default function HighlightsBar({ highlights = [] }: HighlightsBarProps) {
  if (highlights.length === 0) {
    return (
      <div className="flex gap-4 px-4 md:px-0 mb-6 overflow-x-auto scrollbar-none">
        <div className="flex flex-col items-center gap-1">
          <div className="w-[56px] h-[56px] rounded-full border-2 border-dashed border-[var(--ig-border)] flex items-center justify-center">
            <span className="text-2xl text-[var(--ig-text-secondary)]">+</span>
          </div>
          <span className="text-xs text-[var(--ig-text-secondary)]">New</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 px-4 md:px-0 mb-6 overflow-x-auto scrollbar-none">
      {highlights.map((h) => (
        <div key={h.id} className="flex flex-col items-center gap-1">
          <Avatar src={h.coverUrl} alt={h.title} size="lg" hasStory />
          <span className="text-xs truncate w-14 text-center">{h.title}</span>
        </div>
      ))}
    </div>
  );
}
