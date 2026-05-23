"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api-client";

export default function PrivacySettingsPage() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<{
      isPrivate: boolean;
      activityStatus: boolean;
      allowTagging: boolean;
    }>("/settings/privacy")
      .then((data) => {
        setIsPrivate(data.isPrivate);
        setActivityStatus(data.activityStatus);
        setAllowTagging(data.allowTagging);
      })
      .catch(() => {});
  }, []);

  const save = async (field: string, value: boolean) => {
    setLoading(true);
    await apiFetch("/settings/privacy", {
      method: "PUT",
      body: JSON.stringify({ [field]: value }),
    });
    setLoading(false);
  };

  const toggles = [
    {
      key: "isPrivate",
      label: "Private account",
      desc: "Only approved followers can see your posts",
      value: isPrivate,
      set: setIsPrivate,
    },
    {
      key: "activityStatus",
      label: "Show activity status",
      desc: "Let others see when you're active",
      value: activityStatus,
      set: setActivityStatus,
    },
    {
      key: "allowTagging",
      label: "Allow tags",
      desc: "Control who can tag you in posts",
      value: allowTagging,
      set: setAllowTagging,
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Privacy</h1>
      <div className="flex flex-col gap-4">
        {toggles.map(({ key, label, desc, value, set }) => (
          <div
            key={key}
            className="flex items-center justify-between py-3 border-b border-[var(--ig-border)]"
          >
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-[var(--ig-text-secondary)]">{desc}</p>
            </div>
            <button
              role="switch"
              aria-checked={value}
              onClick={() => {
                set(!value);
                save(key, !value);
              }}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? "bg-[#0095F6]" : "bg-[var(--ig-bg-tertiary)]"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
