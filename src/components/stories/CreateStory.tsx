"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Image as ImageIcon, Camera, X } from "lucide-react";

interface CreateStoryProps {
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateStory({ onClose, onCreated }: CreateStoryProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("media", file);
      formData.append("caption", caption);

      const uploadRes = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { urls, mediaType } = await uploadRes.json();

      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaUrl: urls[0],
          mediaType: mediaType ?? "photo",
          caption,
        }),
      });
      if (!res.ok) throw new Error("Story creation failed");
      onCreated?.();
      onClose();
    } catch {
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-[420px] aspect-square bg-gray-900 rounded flex flex-col items-center justify-center gap-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {preview ? (
          <>
            <Image
              src={preview}
              alt=""
              fill
              className="object-contain"
              sizes="420px"
            />
            <div className="absolute bottom-20 left-0 right-0 px-4">
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/50 px-2 py-2 text-sm outline-none"
              />
            </div>
            <div className="absolute bottom-4 flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                Retake
              </Button>
              <Button size="sm" loading={uploading} onClick={handleSubmit}>
                Share
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-6">
              <button
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center gap-2 text-white/80 hover:text-white"
              >
                <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <span className="text-xs">Gallery</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white">
                <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
                <span className="text-xs">Camera</span>
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </>
        )}
      </div>
    </div>
  );
}
