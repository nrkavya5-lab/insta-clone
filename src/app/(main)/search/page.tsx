import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";
import { Loader2 } from "lucide-react";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--ig-text-secondary)]" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
