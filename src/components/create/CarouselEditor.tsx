"use client";

import { DragEvent, useState } from "react";
import MediaPreview from "./MediaPreview";
import { X, GripVertical } from "lucide-react";

interface CarouselEditorProps {
  files: File[];
  onReorder: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export default function CarouselEditor({
  files,
  onReorder,
  onRemove,
}: CarouselEditorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...files];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    onReorder(reordered);
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {files.map((file, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className="relative flex-shrink-0 w-20 cursor-grab active:cursor-grabbing group"
          >
            <MediaPreview
              file={file}
              index={i}
              total={files.length}
              selected={selectedIndex === i}
              onSelect={() => setSelectedIndex(i)}
            />
            <button
              onClick={() => onRemove(i)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--ig-error)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white drop-shadow" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
