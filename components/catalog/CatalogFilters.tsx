import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS, type CategorySort } from "@/lib/books";

export function CatalogFilters({
  basePath,
  sort,
  minPrice,
  maxPrice,
}: {
  basePath: string;
  sort: CategorySort;
  minPrice?: number;
  maxPrice?: number;
}) {
  const hasActiveFilters = minPrice !== undefined || maxPrice !== undefined || sort !== "noi";

  return (
    <form
      method="GET"
      action={basePath}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-center gap-2 text-ink-soft">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm font-semibold">Filtre</span>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="minPrice" className="text-xs font-medium text-ink-soft">
          Preț minim
        </label>
        <input
          id="minPrice"
          type="number"
          name="minPrice"
          min={0}
          defaultValue={minPrice ?? ""}
          placeholder="0"
          className="w-24 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-ink focus:border-terracotta focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="maxPrice" className="text-xs font-medium text-ink-soft">
          Preț maxim
        </label>
        <input
          id="maxPrice"
          type="number"
          name="maxPrice"
          min={0}
          defaultValue={maxPrice ?? ""}
          placeholder="500"
          className="w-24 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-ink focus:border-terracotta focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sort" className="text-xs font-medium text-ink-soft">
          Sortează după
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={sort}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-ink focus:border-terracotta focus:outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-terracotta-dark"
      >
        Aplică
      </button>

      {hasActiveFilters && (
        <Link href={basePath} className="text-sm font-medium text-ink-soft hover:text-terracotta">
          Resetează
        </Link>
      )}
    </form>
  );
}
