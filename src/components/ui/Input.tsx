"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--ig-text-primary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--ig-text-secondary)]",
            "focus:border-[var(--ig-border-focus)]",
            error && "border-[var(--ig-error)]",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--ig-error)]">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
