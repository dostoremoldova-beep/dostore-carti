import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPopularCategories } from "@/lib/categories";
import { CategoryIcon } from "@/components/CategoryIcon";

export async function CategoriesSection() {
  const categories = await getPopularCategories(6);

  return (
    <section className="bg-cream-soft py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="font-medium uppercase tracking-widest text-terracotta">Explorează</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold text-ink">Categorii populare</h2>
        </div>

        {/* Câte una pe rând, ca imaginea fiecărei categorii să aibă loc real.
            Rândul e „space between": text la stânga, imagine la dreapta. */}
        <ul className="flex flex-col gap-4">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/carti?categorii=${category.slug}`}
                className="group flex items-center justify-between gap-6 overflow-hidden rounded-xl bg-card ring-1 ring-border/70 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-5 py-5 pl-6">
                  {!category.image && (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream-soft text-terracotta">
                      <CategoryIcon slug={category.slug} name={category.name} className="h-5 w-5" />
                    </span>
                  )}
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-ink group-hover:text-terracotta">
                      {category.name}
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta">
                      Vezi produsele
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>

                {category.image && (
                  <div className="relative h-28 w-44 shrink-0 sm:h-32 sm:w-64">
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 176px, 256px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
