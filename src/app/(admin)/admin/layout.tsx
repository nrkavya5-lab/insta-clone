import Link from "next/link";
import { BarChart3, Users, Flag } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: Flag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--ig-bg-secondary)]">
      <aside className="w-56 border-r border-[var(--ig-border)] bg-[var(--ig-bg-primary)] p-4 flex flex-col gap-1">
        <h1 className="text-lg font-bold mb-4 px-3">Admin Panel</h1>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded text-sm font-semibold hover:bg-[var(--ig-bg-tertiary)] transition-colors"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
