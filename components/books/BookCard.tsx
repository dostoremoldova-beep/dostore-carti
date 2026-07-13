import type { Book } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { StarRating } from "./StarRating";
import { PriceTag } from "./PriceTag";

export function BookCard({ book }: { book: Book }) {
  const outOfStock = book.stock <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/70 transition-shadow hover:shadow-md">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-cream-soft">
        <Link href={`/carti/${book.slug}`} className="relative block h-full w-full">
          <Image
            src={book.coverImage}
            alt={`Coperta cărții ${book.title}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          aria-label="Adaugă la favorite"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-navy shadow-sm backdrop-blur transition-colors hover:text-terracotta"
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
        </button>

        {book.discountPrice != null && book.discountPrice < book.price && (
          <span className="absolute left-2 top-2 rounded-full bg-terracotta px-2 py-0.5 text-[11px] font-semibold text-cream">
            Reducere
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
            <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-ink">
              Stoc epuizat
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <Link
          href={`/carti/${book.slug}`}
          className="line-clamp-2 text-sm font-semibold text-ink hover:text-terracotta"
        >
          {book.title}
        </Link>
        <p className="text-xs text-ink-soft">{book.author}</p>

        <StarRating rating={book.rating} reviewCount={book.reviewCount} size={14} />

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <PriceTag price={book.price} discountPrice={book.discountPrice} />
          <button
            type="button"
            disabled={outOfStock}
            aria-label={`Adaugă „${book.title}” în coș`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta text-cream transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-ink-soft"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
