import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <Sidebar />
      <TopBar />
      <main className="md:ml-[72px] lg:ml-[244px] pb-14 md:pb-0 pt-11 md:pt-0 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-full max-w-[630px] lg:mr-[319px] xl:mr-0">
            {children}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
