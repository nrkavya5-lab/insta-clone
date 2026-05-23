"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  gradient?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  disabled,
  className,
  children,
  gradient,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 active:scale-[0.97]";

  const variants: Record<string, string> = {
    primary: "bg-[#405DE6] text-white hover:bg-[#3a52d5] hover:shadow-md",
    secondary:
      "border border-[var(--ig-border)] text-[var(--ig-text-primary)] hover:bg-[var(--ig-bg-tertiary)] hover:border-[var(--ig-text-secondary)]",
    ghost: "text-[var(--ig-text-primary)] hover:bg-[var(--ig-bg-tertiary)]",
    danger: "bg-gradient-to-r from-[#ed4956] to-[#fd1d1d] text-white hover:shadow-lg hover:shadow-[#ed4956]/20",
  };

  const sizes: Record<string, string> = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-sm px-6 py-2.5",
  };

  const gradientClass = gradient
    ? "bg-gradient-to-r from-[#405de6] via-[#833ab4] to-[#e1306c] text-white hover:shadow-lg hover:shadow-[#833ab4]/20"
    : "";

  return (
    <button
      className={cn(
        base,
        gradient ? gradientClass : variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
