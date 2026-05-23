import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] p-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          Trouble logging in?
        </h1>
        <p className="text-center text-[var(--ig-text-secondary)] text-sm mb-6">
          Enter your email and we&apos;ll send you a link to get back into your
          account.
        </p>
        <ForgotPasswordForm />
      </div>
      <div className="rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] p-4 text-center text-sm">
        <Link href="/login" className="font-semibold">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
