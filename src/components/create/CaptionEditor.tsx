"use client";

import { useState, useRef, useEffect } from "react";

interface CaptionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const popularHashtags = [
  "love",
  "instagood",
  "photooftheday",
  "beautiful",
  "fashion",
  "happy",
  "art",
  "nature",
  "picoftheday",
  "travel",
];

export default function CaptionEditor({ value, onChange }: CaptionEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tagSearch, setTagSearch] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);

    const lastWord = text.split(" ").pop() ?? "";
    if (lastWord.startsWith("#") && lastWord.length > 1) {
      setTagSearch(lastWord.slice(1));
      setShowTagSuggestions(true);
    } else {
      setShowTagSuggestions(false);
    }
  };

  const insertHashtag = (tag: string) => {
    const words = value.split(" ");
    words[words.length - 1] = `#${tag} `;
    onChange(words.join(" "));
    setShowTagSuggestions(false);
    textareaRef.current?.focus();
  };

  const suggestions = tagSearch
    ? popularHashtags.filter((h) => h.startsWith(tagSearch.toLowerCase()))
    : [];

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder="Write a caption..."
        rows={4}
        maxLength={2200}
        className="w-full resize-none rounded border border-[var(--ig-border)] bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[var(--ig-border-focus)]"
      />
      <span className="absolute bottom-2 right-3 text-xs text-[var(--ig-text-secondary)]">
        {value.length}/2200
      </span>

      {showTagSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] shadow-lg z-10 max-h-40 overflow-y-auto">
          {suggestions.map((tag) => (
            <button
              key={tag}
              onClick={() => insertHashtag(tag)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--ig-bg-tertiary)] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
