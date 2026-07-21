import { BookGridSkeleton } from "@/components/books/BookGridSkeleton";

// Skeleton pentru catalogul /carti (rută dinamică — searchParams). Nu poate
// da notFound, deci `loading.tsx` e sigur aici (fără soft-404).
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="mb-6 h-4 w-40 animate-pulse rounded bg-cream-soft" />
      <div className="mb-6 h-9 w-40 animate-pulse rounded bg-cream-soft" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[256px_1fr]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-cream-soft" />
          ))}
        </div>
        <div>
          <div className="mb-5 h-4 w-32 animate-pulse rounded bg-cream-soft" />
          <BookGridSkeleton variant="compact" />
        </div>
      </div>
    </div>
  );
}
