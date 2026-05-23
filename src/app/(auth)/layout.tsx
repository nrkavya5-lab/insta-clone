export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-[#405de6]/5 via-[var(--ig-bg-secondary)] to-[#e1306c]/5 px-4 py-12">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
