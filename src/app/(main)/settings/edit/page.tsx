"use client";

import { useSession } from "next-auth/react";
import AvatarUpload from "@/components/settings/AvatarUpload";
import EditProfileForm from "@/components/settings/EditProfileForm";
import { apiFetch } from "@/lib/api-client";

export default function EditProfilePage() {
  const { data: session, update } = useSession();

  const handleAvatarUpdate = (url: string) => {
    update?.();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6 md:hidden">Edit Profile</h1>
      <AvatarUpload
        currentUrl={session?.user?.image ?? null}
        username={session?.user?.name ?? "user"}
        onUpdate={handleAvatarUpdate}
      />
      <EditProfileForm
        initial={{
          name: session?.user?.name ?? "",
          username: (session?.user as { username?: string })?.username ?? "",
          bio: "",
          website: "",
          gender: "",
          avatarUrl: session?.user?.image ?? null,
        }}
      />
    </div>
  );
}
