"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      await signIn("credentials", {
        email: form.email,
        password: form.password,
        callbackUrl: "/feed",
      });
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <p className="text-sm text-[var(--ig-error)] text-center">{error}</p>
      )}
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        className="w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--ig-border-focus)]"
      />
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
        className="w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--ig-border-focus)]"
      />
      <input
        type="text"
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--ig-border-focus)]"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        minLength={6}
        className="w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--ig-border-focus)]"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-[#405DE6] py-2 text-sm font-semibold text-white hover:bg-[#3a52d5] disabled:opacity-50 transition-colors"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
