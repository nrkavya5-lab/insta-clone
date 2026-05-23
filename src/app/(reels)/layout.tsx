export default function ReelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh w-full bg-black fixed inset-0 z-40 overflow-hidden">
      {children}
    </div>
  );
}
