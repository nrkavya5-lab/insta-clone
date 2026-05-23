"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/api-client";

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await apiFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setMessage("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const toggle2FA = async () => {
    try {
      if (twoFactor) {
        await apiFetch("/settings/security/two-factor", { method: "DELETE" });
        setTwoFactor(false);
      } else {
        await apiFetch("/settings/security/two-factor", { method: "POST" });
        setTwoFactor(true);
      }
    } catch {}
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Security</h1>

      <h2 className="text-sm font-semibold mb-3">Change password</h2>
      <form
        onSubmit={handlePasswordChange}
        className="flex flex-col gap-3 mb-8 max-w-sm"
      >
        <Input
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {message && (
          <p className="text-sm text-[var(--ig-text-secondary)]">{message}</p>
        )}
        <Button type="submit" size="sm" loading={loading}>
          Change password
        </Button>
      </form>

      <div className="border-t border-[var(--ig-border)] pt-6">
        <h2 className="text-sm font-semibold mb-3">
          Two-factor authentication
        </h2>
        <div className="flex items-center justify-between max-w-sm">
          <p className="text-sm">{twoFactor ? "Enabled" : "Disabled"}</p>
          <button
            role="switch"
            aria-checked={twoFactor}
            onClick={toggle2FA}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${twoFactor ? "bg-[#0095F6]" : "bg-[var(--ig-bg-tertiary)]"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${twoFactor ? "translate-x-5" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
