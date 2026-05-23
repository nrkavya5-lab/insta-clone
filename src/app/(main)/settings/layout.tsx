"use client";

import SettingsSidebar from "@/components/settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100dvh-44px)] md:min-h-[calc(100dvh-0px)]">
      <div className="hidden md:block w-[240px] border-r border-[var(--ig-border)] p-4 flex-shrink-0">
        <h1 className="text-xl font-semibold mb-4">Settings</h1>
        <SettingsSidebar />
      </div>
      <div className="flex-1 p-4 md:p-8 max-w-2xl">{children}</div>
    </div>
  );
}
