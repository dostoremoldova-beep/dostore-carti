import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, ArrowRight } from "lucide-react";
import type { Category } from "@prisma/client";
import { CategoryIcon } from "@/components/CategoryIcon";

/**
 * Meniu de categorii — CSS pur, fără JavaScript.
 *
 * Se deschide ÎN JOS, pe toată lățimea barei de navigare (mega-menu), într-o
 * SINGURĂ COLOANĂ. Deschiderea e controlată din globals.css (regula
 * `.categories-menu:has(...)`) — scopată strict la hover pe buton sau pe
 * panou, NU la orice hover din bară (bug reparat: înainte, un `group` pus pe
 * toată bara făcea ca hover peste „Bestsellers" să deschidă și el panoul).
 */

/** Butonul care declanșează meniul (stă în bară). */
export function CategoriesTrigger() {
  return (
    <button
      type="button"
      aria-haspopup="true"
      className="categories-trigger flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-terracotta px-4 py-2 font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-terracotta-dark"
    >
      <Menu className="h-4 w-4" aria-hidden="true" />
      Categorii
      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}

/** Panoul care coboară sub bară, pe toată lățimea, cu categoriile într-o coloană. */
export function CategoriesPanel({ categories }: { categories: Category[] }) {
  return (
    <div className="categories-panel invisible absolute inset-x-0 top-full z-50 pt-2.5 opacity-0 transition-[opacity,visibility] duration-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-3 shadow-xl">
          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/carti?categorii=${category.slug}`}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-cream-soft hover:text-terracotta"
              >
                {category.image ? (
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-cream-soft">
                    <Image src={category.image} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-soft text-terracotta">
                    <CategoryIcon slug={category.slug} name={category.name} className="h-4.5 w-4.5" />
                  </span>
                )}
                <span className="flex-1 font-medium">{category.name}</span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-terracotta opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
          <Link
            href="/categorii"
            className="mt-2 block border-t border-border pt-2.5 text-center text-sm font-semibold text-navy transition-colors hover:text-terracotta"
          >
            Vezi toate categoriile →
          </Link>
        </div>
      </div>
    </div>
  );
}
