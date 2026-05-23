"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface MediaPreviewProps {
  file: File;
  index: number;
  total: number;
  selected?: boolean;
  onSelect?: () => void;
}

const filters = [
  { name: "Normal", className: "" },
  { name: "Clarendon", className: "brightness-110 contrast-110 saturate-125" },
  { name: "Gingham", className: "brightness-105 sepia" },
  {
    name: "Juno",
    className: "brightness-110 contrast-85 saturate-110 hue-rotate-15",
  },
  {
    name: "Lark",
    className: "brightness-105 contrast-90 saturate-90 hue-rotate-10",
  },
  { name: "Reyes", className: "brightness-110 contrast-85 saturate-80 sepia" },
];

export default function MediaPreview({
  file,
  index,
  total,
  selected,
  onSelect,
}: MediaPreviewProps) {
  const url = URL.createObjectURL(file);

  return (
    <div className="relative">
      <div
        className={cn(
          "relative aspect-square rounded overflow-hidden bg-[var(--ig-bg-tertiary)]",
          selected && "ring-2 ring-[#0095F6]",
        )}
      >
        <Image
          src={url}
          alt={`Preview ${index + 1}`}
          fill
          className="object-cover"
          sizes="300px"
          onLoad={() => URL.revokeObjectURL(url)}
        />
      </div>
      {total > 1 && (
        <button
          onClick={onSelect}
          className={cn(
            "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
            selected
              ? "bg-[#0095F6] text-white"
              : "bg-[var(--ig-overlay)] text-white",
          )}
        >
          {selected ? <Check className="w-3 h-3" /> : index + 1}
        </button>
      )}
    </div>
  );
}
