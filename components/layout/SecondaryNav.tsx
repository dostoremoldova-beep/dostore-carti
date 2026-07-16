import Link from "next/link";
import { secondaryNavLinks } from "@/lib/nav-links";
import { getAllCategories } from "@/lib/categories";
import { CategoriesDropdown } from "./CategoriesDropdown";

export async function SecondaryNav() {
  const categories = await getAllCategories();

  return (
    <nav aria-label="Navigație principală" className="hidden bg-navy md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3 text-sm font-medium text-cream/90 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
        {secondaryNavLinks.map((link) =>
          link.href === "/categorii" ? (
            <CategoriesDropdown key={link.href} categories={categories} />
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 whitespace-nowrap transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
