"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/api-client";

interface FollowButtonProps {
  userId: string;
  initialStatus: "none" | "following" | "pending" | "self";
  onStatusChange?: (status: "none" | "following" | "pending") => void;
  size?: "sm" | "md";
}

export default function FollowButton({
  userId,
  initialStatus,
  onStatusChange,
  size = "sm",
}: FollowButtonProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  if (status === "self") return null;

  const handleClick = async () => {
    setLoading(true);
    try {
      if (status === "following") {
        await apiFetch(`/users/${userId}/unfollow`, { method: "DELETE" });
        setStatus("none");
        onStatusChange?.("none");
      } else if (status === "pending") {
        await apiFetch(`/users/${userId}/unfollow`, { method: "DELETE" });
        setStatus("none");
        onStatusChange?.("none");
      } else {
        const res = await apiFetch<{ status: string }>(
          `/users/${userId}/follow`,
          {
            method: "POST",
          },
        );
        const newStatus = res.status === "pending" ? "pending" : "following";
        setStatus(newStatus);
        onStatusChange?.(newStatus);
      }
    } catch {
      setStatus(status);
    } finally {
      setLoading(false);
    }
  };

  if (status === "following") {
    return (
      <Button
        variant="secondary"
        size={size}
        loading={loading}
        onClick={handleClick}
        className="hover:text-[var(--ig-error)] hover:border-[var(--ig-error)]"
      >
        Following
      </Button>
    );
  }

  if (status === "pending") {
    return (
      <Button
        variant="secondary"
        size={size}
        loading={loading}
        onClick={handleClick}
      >
        Requested
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size={size}
      loading={loading}
      onClick={handleClick}
    >
      Follow
    </Button>
  );
}
