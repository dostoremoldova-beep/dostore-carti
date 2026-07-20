import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import type { Category } from "@prisma/client";
import { CategoryIcon } from "@/components/CategoryIcon";

/**
 * Dropdown de categorii — CSS pur, fără JavaScript.
 *
 * Înainte era o componentă client cu useState + listeners de scroll/resize/click
 * și repoziționare manuală. Fiind în header, JS-ul ei se încărca pe FIECARE
 * pagină din site. Aici deschiderea se face din `group-hover` / `focus-within`,
 * deci zero JS trimis către browser și funcționează și fără hidratare.
 *
 * Accesibilitate: `focus-within` ține panoul deschis la navigarea cu Tab, iar
 * link-urile sunt reale, deci sunt accesibile și cu tastatura.
 */
export function CategoriesDropdown({ categories }: { categories: Category[] }) {
  return (
    <div className="group relative shrink-0">
      <button
        type="button"
        aria-haspopup="true"
        className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-terracotta px-4 py-2 font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-terracotta-dark"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
        Categorii
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
          aria-hidden="true"
        />
      </button>

      {/* `pt-2` păstrează o punte invizibilă între buton și panou, ca mouse-ul
          să nu treacă printr-un gol și să închidă meniul. */}
      <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="grid w-[34rem] max-w-[90vw] grid-cols-2 gap-0.5 rounded-xl border border-border bg-card p-3 shadow-xl">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/carti?categorii=${category.slug}`}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-cream-soft hover:text-terracotta"
            >
              <CategoryIcon
                slug={category.slug}
                name={category.name}
                className="h-4 w-4 shrink-0 text-terracotta"
              />
              {category.name}
            </Link>
          ))}
          <Link
            href="/categorii"
            className="col-span-2 mt-1 border-t border-border pt-2.5 text-center text-sm font-semibold text-navy transition-colors hover:text-terracotta"
          >
            Vezi toate categoriile →
          </Link>
        </div>
      </div>
    </div>
  );
}
