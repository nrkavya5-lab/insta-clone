"use client";

import { useState, useRef } from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/api-client";

interface AvatarUploadProps {
  currentUrl: string | null;
  username: string;
  onUpdate: (url: string) => void;
}

export default function AvatarUpload({
  currentUrl,
  username,
  onUpdate,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("/api/users/me/avatar", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onUpdate(data.avatarUrl);
    } catch {
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <Avatar src={preview ?? currentUrl} alt={username} size="xl" />
      <div>
        <p className="text-sm font-semibold">{username}</p>
        <button
          onClick={() => inputRef.current?.click()}
          className="text-sm font-semibold text-[#0095F6] hover:text-[#00376B] transition-colors"
        >
          Change photo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {loading && (
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 rounded-full border-2 border-[#0095F6] border-t-transparent animate-spin" />
            <span className="text-xs text-[var(--ig-text-secondary)]">
              Uploading...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
