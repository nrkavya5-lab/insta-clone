"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setError("No account found with that email");
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong");
    }
  }

  if (sent) {
    return (
      <p className="text-sm text-center text-[var(--ig-text-secondary)]">
        Check your email for a reset link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <p className="text-sm text-[var(--ig-error)] text-center">{error}</p>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--ig-border-focus)]"
      />
      <button
        type="submit"
        className="w-full rounded bg-[#405DE6] py-2 text-sm font-semibold text-white hover:bg-[#3a52d5] transition-colors"
      >
        Send Reset Link
      </button>
    </form>
  );
}
