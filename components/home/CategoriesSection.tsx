import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPopularCategories } from "@/lib/categories";
import { CategoryIcon } from "@/components/CategoryIcon";

export async function CategoriesSection() {
  const categories = await getPopularCategories(4);

  return (
    <section className="bg-cream-soft py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="font-medium uppercase tracking-widest text-terracotta">Explorează</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold text-ink">Categorii populare</h2>
        </div>

        {/* Toate pe un rând pe desktop; iconița sus, centrată. */}
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/carti?categorii=${category.slug}`}
                className="group flex h-full flex-col items-center gap-3 rounded-xl bg-card p-6 text-center shadow-sm ring-1 ring-border/70 transition-shadow hover:shadow-md"
              >
                <span className="flex h-24 w-24 items-center justify-center">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt=""
                      width={96}
                      height={96}
                      className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-soft text-terracotta">
                      <CategoryIcon slug={category.slug} name={category.name} className="h-7 w-7" />
                    </span>
                  )}
                </span>

                <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-terracotta">
                  {category.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta">
                  Vezi produsele
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
