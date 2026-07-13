import type { Book } from "@prisma/client";
import { BookGrid } from "@/components/books/BookGrid";

export function SimpleBookListing({
  title,
  subtitle,
  books,
  emptyMessage,
}: {
  title: string;
  subtitle?: string;
  books: Book[];
  emptyMessage?: string;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-ink-soft">{subtitle}</p>}
      </div>

      <BookGrid books={books} variant="wide" emptyMessage={emptyMessage} />
    </div>
  );
}
