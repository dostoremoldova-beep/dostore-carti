import { Star } from "lucide-react";

const STAR_INDEXES = [0, 1, 2, 3, 4];

export function StarRating({
  rating,
  reviewCount,
  size = 16,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
}) {
  const rounded = Math.round(Math.max(0, Math.min(5, rating)));

  return (
    <div className="flex items-center gap-1.5">
      {/* Un singur strat de steluțe: pline (aurii) până la rating, restul contur
          simplu. Fără straturi suprapuse, deci fără efectul de „umbră". */}
      <div className="flex gap-0.5" aria-hidden="true">
        {STAR_INDEXES.map((i) =>
          i < rounded ? (
            <Star
              key={i}
              width={size}
              height={size}
              className="text-gold"
              fill="currentColor"
              stroke="none"
            />
          ) : (
            <Star
              key={i}
              width={size}
              height={size}
              className="text-gold/35"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            />
          )
        )}
      </div>
      <span className="sr-only">{rating.toFixed(1)} din 5 stele</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-ink-soft">({reviewCount})</span>
      )}
    </div>
  );
}
