import LoginForm from "@/components/auth/LoginForm";
import OAuthButtons from "@/components/auth/OAuthButtons";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="rounded-2xl border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] p-8 shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#405de6] to-[#e1306c] flex items-center justify-center text-white text-xl font-bold shadow-lg">
            I
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-1 gradient-text">
          Insta Clone
        </h1>
        <p className="text-sm text-center text-[var(--ig-text-secondary)] mb-6">
          Sign in to see photos from your friends
        </p>
        <LoginForm />
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--ig-border)] to-transparent" />
          <span className="text-xs font-semibold text-[var(--ig-text-secondary)] uppercase tracking-wider">
            OR
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--ig-border)] to-transparent" />
        </div>
        <OAuthButtons />
        <p className="text-sm text-center mt-4">
          <Link
            href="/forgot-password"
            className="text-[var(--ig-text-link)] text-xs font-semibold hover:underline"
          >
            Forgot password?
          </Link>
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] p-4 text-center text-sm shadow-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#405DE6] font-bold hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
