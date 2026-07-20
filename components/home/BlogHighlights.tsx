import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/blog";

/**
 * Cele mai recente articole de pe blog, ca trei carduri orizontale: text în
 * stânga, imagine în dreapta care iese până la marginea cardului.
 * Înlocuiește vechile „PromoBanners" statice — conținutul vine acum din admin.
 */
export async function BlogHighlights() {
  const posts = await getPublishedPosts(3);
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-medium uppercase tracking-widest text-terracotta">De pe blog</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold text-ink">
            Citește înainte să alegi
          </h2>
        </div>
        <Link
          href="/blog"
          className="hidden shrink-0 text-sm font-semibold text-terracotta hover:text-terracotta-dark sm:block"
        >
          Toate articolele →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {posts.map((post) => (
          // Imaginile sunt compuse cu subiectul în dreapta și spațiu liber în
          // stânga, deci textul stă PESTE imagine, în zona goală — nu alături.
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group relative flex aspect-[16/9] items-center overflow-hidden rounded-xl ring-1 ring-border/60 transition-shadow hover:shadow-lg"
          >
            <Image
              src={post.coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Voal dinspre stânga, ca textul să rămână lizibil peste imagine */}
            <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/75 to-transparent" />

            <div className="relative flex max-w-[62%] flex-col gap-1.5 p-5">
              <h3 className="font-serif text-lg font-semibold leading-snug text-ink">
                {post.title}
              </h3>
              <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">{post.excerpt}</p>
              <span className="mt-2 inline-flex w-fit rounded-full border border-ink/30 bg-cream/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink transition-colors group-hover:border-terracotta group-hover:text-terracotta">
                Citește
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
