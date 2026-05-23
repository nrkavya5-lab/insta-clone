"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Image, X } from "lucide-react";

interface MediaUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export default function MediaUploader({
  files,
  onFilesChange,
  multiple = true,
  maxFiles = 10,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    const combined = [...files, ...dropped].slice(0, maxFiles);
    onFilesChange(combined);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith("image/"),
    );
    const combined = [...files, ...selected].slice(0, maxFiles);
    onFilesChange(combined);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  if (files.length > 0) {
    return null;
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded border-2 border-dashed p-12 cursor-pointer transition-colors",
        dragging
          ? "border-[#0095F6] bg-blue-50 dark:bg-blue-900/10"
          : "border-[var(--ig-border)] hover:border-[var(--ig-text-secondary)]",
      )}
    >
      <Image className="w-16 h-16 text-[var(--ig-text-secondary)]" />
      <p className="text-xl font-light">Drag photos here</p>
      <p className="text-sm text-[var(--ig-text-secondary)]">
        or click to browse
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={handleSelect}
      />
    </div>
  );
}
