"use client";

import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useThemeStore();

  const themes = [
    { value: "light" as const, label: "Light" },
    { value: "dark" as const, label: "Dark" },
    { value: "system" as const, label: "System default" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Appearance</h1>
      <h2 className="text-sm font-semibold mb-3">Theme</h2>
      <div className="flex flex-col gap-2">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded text-sm transition-colors border border-[var(--ig-border)]",
              theme === t.value && "border-[#0095F6] bg-[#0095F6]/5",
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                theme === t.value
                  ? "border-[#0095F6]"
                  : "border-[var(--ig-text-secondary)]",
              )}
            >
              {theme === t.value && (
                <div className="w-2 h-2 rounded-full bg-[#0095F6]" />
              )}
            </div>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
