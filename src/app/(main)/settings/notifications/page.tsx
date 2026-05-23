"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api-client";

interface Prefs {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  dms: boolean;
  reminders: boolean;
}

const labels: Record<keyof Prefs, { label: string; desc: string }> = {
  likes: { label: "Likes", desc: "Someone likes your post" },
  comments: { label: "Comments", desc: "Someone comments on your post" },
  follows: { label: "Follows", desc: "Someone follows you" },
  dms: { label: "Direct messages", desc: "Someone sends you a message" },
  reminders: { label: "Reminders", desc: "Birthdays, memories, and more" },
};

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>({
    likes: true,
    comments: true,
    follows: true,
    dms: true,
    reminders: true,
  });

  useEffect(() => {
    apiFetch<Prefs>("/settings/notifications")
      .then(setPrefs)
      .catch(() => {});
  }, []);

  const toggle = async (key: keyof Prefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    await apiFetch("/settings/notifications", {
      method: "PUT",
      body: JSON.stringify(updated),
    });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Push notifications</h1>
      <div className="flex flex-col gap-2">
        {(Object.keys(labels) as (keyof Prefs)[]).map((key) => (
          <div
            key={key}
            className="flex items-center justify-between py-3 border-b border-[var(--ig-border)]"
          >
            <div>
              <p className="text-sm font-semibold">{labels[key].label}</p>
              <p className="text-xs text-[var(--ig-text-secondary)]">
                {labels[key].desc}
              </p>
            </div>
            <button
              role="switch"
              aria-checked={prefs[key]}
              onClick={() => toggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${prefs[key] ? "bg-[#0095F6]" : "bg-[var(--ig-bg-tertiary)]"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${prefs[key] ? "translate-x-5" : ""}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
