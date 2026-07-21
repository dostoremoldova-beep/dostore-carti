// Skeleton pentru listarea /blog (rută dinamică — searchParams „page").
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="mb-10 max-w-2xl">
        <div className="h-4 w-24 animate-pulse rounded bg-cream-soft" />
        <div className="mt-3 h-10 w-full animate-pulse rounded bg-cream-soft" />
        <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-cream-soft" />
      </div>
      <div className="mb-10 h-72 animate-pulse rounded-2xl bg-cream-soft" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl ring-1 ring-border/70">
            <div className="aspect-[16/10] animate-pulse bg-cream-soft" />
            <div className="space-y-2 p-5">
              <div className="h-3 w-24 animate-pulse rounded bg-cream-soft" />
              <div className="h-5 w-full animate-pulse rounded bg-cream-soft" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-cream-soft" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
