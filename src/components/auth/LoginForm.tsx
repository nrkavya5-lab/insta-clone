"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/feed");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <p className="text-sm text-[var(--ig-error)] text-center">{error}</p>
      )}
      <input
        type="email"
        placeholder="Email or username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--ig-border-focus)]"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--ig-border-focus)]"
      />
      <button
        type="submit"
        className="w-full rounded bg-[#405DE6] py-2 text-sm font-semibold text-white hover:bg-[#3a52d5] transition-colors"
      >
        Log In
      </button>
    </form>
  );
}
