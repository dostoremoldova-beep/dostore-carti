import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildQueryString } from "@/lib/url";

export function Pagination({
  basePath,
  currentPage,
  totalPages,
  query,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  query: Record<string, string | number | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => `${basePath}${buildQueryString({ ...query, page })}`;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Paginare" className="mt-8 flex items-center justify-center gap-1.5">
      <Link
        href={hrefFor(Math.max(1, currentPage - 1))}
        aria-label="Pagina anterioară"
        aria-disabled={currentPage === 1}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors ${
          currentPage === 1
            ? "pointer-events-none text-border"
            : "text-ink hover:border-terracotta hover:text-terracotta"
        }`}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={hrefFor(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-terracotta text-cream"
              : "text-ink hover:bg-cream-soft"
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={hrefFor(Math.min(totalPages, currentPage + 1))}
        aria-label="Pagina următoare"
        aria-disabled={currentPage === totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors ${
          currentPage === totalPages
            ? "pointer-events-none text-border"
            : "text-ink hover:border-terracotta hover:text-terracotta"
        }`}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </nav>
  );
}
