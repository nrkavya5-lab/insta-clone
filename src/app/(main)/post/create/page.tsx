"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaUploader from "@/components/create/MediaUploader";
import CarouselEditor from "@/components/create/CarouselEditor";
import CaptionEditor from "@/components/create/CaptionEditor";
import LocationPicker from "@/components/create/LocationPicker";
import Button from "@/components/ui/Button";
import { ArrowLeft, ChevronRight, Image, MapPin, Hash, Sparkles } from "lucide-react";

const quickHashtags = ["#photography", "#travel", "#nature", "#food", "#fashion", "#art", "#music", "#fitness"];

export default function CreatePostPage() {
  const router = useRouter();
  const [step, setStep] = useState("media");
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [posting, setPosting] = useState(false);

  const handleReorder = (reordered: File[]) => setFiles(reordered);
  const handleRemove = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const insertHashtag = (tag: string) => {
    setCaption((prev) => `${prev} ${tag} `.trimStart());
  };

  const handlePost = async () => {
    if (files.length === 0) return;
    setPosting(true);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("media", f));
      formData.append("caption", caption);
      formData.append("location", location);

      const uploadRes = await fetch("/api/media/upload?__dev=1", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { urls, mediaType } = await uploadRes.json();

      const postRes = await fetch("/api/posts?__dev=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaUrls: urls, mediaType: mediaType ?? "photo", caption, location }),
      });
      if (!postRes.ok) throw new Error("Post creation failed");
      router.push("/feed");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--ig-border)]">
        <button
          onClick={() => (step === "media" ? router.back() : setStep("media"))}
          aria-label="Back"
          className="p-2 rounded-full hover:bg-[var(--ig-bg-tertiary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold gradient-text">Create post</h1>
        <div className="flex-1" />
        {files.length > 0 && step === "media" && (
          <Button
            size="sm"
            gradient
            onClick={() => setStep("details")}
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        )}
        {step === "details" && (
          <Button size="sm" gradient loading={posting} onClick={handlePost}>
            Share
          </Button>
        )}
      </div>

      {step === "media" && (
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-[var(--ig-border)] p-8 text-center hover:border-[#405de6]/30 transition-colors">
            <MediaUploader files={files} onFilesChange={setFiles} />
          </div>
          {files.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Image className="w-4 h-4 text-[#405de6]" />
                Selected media ({files.length})
              </h3>
              <CarouselEditor files={files} onReorder={handleReorder} onRemove={handleRemove} />
            </div>
          )}
          {files.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#405de6]/10 to-[#e1306c]/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-7 h-7 text-[#405de6]" />
              </div>
              <p className="text-sm font-medium text-[var(--ig-text-primary)]">Tap above to select photos</p>
              <p className="text-xs text-[var(--ig-text-secondary)] mt-1">You can select multiple photos for a carousel</p>
            </div>
          )}
        </div>
      )}

      {step === "details" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2">
            {files.map((file, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[var(--ig-bg-tertiary)] ring-1 ring-black/5">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--ig-text-secondary)] uppercase tracking-wider">Caption</label>
            <CaptionEditor value={caption} onChange={setCaption} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickHashtags.map((tag) => (
              <button
                key={tag}
                onClick={() => insertHashtag(tag)}
                className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-[#405de6]/10 to-[#e1306c]/10 text-[#405de6] font-medium hover:from-[#405de6]/20 hover:to-[#e1306c]/20 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--ig-text-secondary)] uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </label>
            <LocationPicker value={location} onChange={setLocation} />
          </div>
        </div>
      )}
    </div>
  );
}
