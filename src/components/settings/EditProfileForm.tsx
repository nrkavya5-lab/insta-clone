"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/api-client";

interface EditProfileFormProps {
  initial: {
    name: string;
    username: string;
    bio: string;
    website: string;
    gender: string;
    avatarUrl: string | null;
  };
}

export default function EditProfileForm({ initial }: EditProfileFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          bio: form.bio,
          website: form.website,
          gender: form.gender,
        }),
      });
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="text-sm text-[var(--ig-error)] bg-red-50 dark:bg-red-900/20 rounded p-3">
          {error}
        </p>
      )}

      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full name"
      />

      <Input
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--ig-text-primary)]">
          Bio
        </label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          maxLength={150}
          className="w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] px-3 py-2.5 text-sm outline-none transition-colors resize-none focus:border-[var(--ig-border-focus)]"
        />
        <span className="text-xs text-[var(--ig-text-secondary)] text-right">
          {form.bio.length}/150
        </span>
      </div>

      <Input
        label="Website"
        name="website"
        value={form.website}
        onChange={handleChange}
        placeholder="https://example.com"
        type="url"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--ig-text-primary)]">
          Gender
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--ig-border-focus)]"
        >
          <option value="">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          Submit
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
