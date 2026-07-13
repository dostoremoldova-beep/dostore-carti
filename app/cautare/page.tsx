import type { Metadata } from "next";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Căutare — BookStore",
  description: "Caută cărți, autori sau categorii pe BookStore.",
};

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function CautarePage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream-soft text-terracotta">
        <Search className="h-6 w-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-serif text-2xl font-semibold text-ink sm:text-3xl">
        {q ? (
          <>
            Rezultate pentru <span className="text-terracotta">„{q}”</span>
          </>
        ) : (
          "Caută pe BookStore"
        )}
      </h1>
      <p className="mt-3 text-ink-soft">
        Căutarea completă vine în curând — lucrăm la ea. Momentan poți explora cărțile prin
        categorii sau prin secțiunile de bestsellers și noutăți.
      </p>
    </div>
  );
}
