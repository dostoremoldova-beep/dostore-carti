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
  const percent = Math.round((Math.max(0, Math.min(5, rating)) / 5) * 100);

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative inline-flex" aria-hidden="true">
        <div className="flex gap-0.5 text-border">
          {STAR_INDEXES.map((i) => (
            <Star key={i} width={size} height={size} fill="currentColor" stroke="none" />
          ))}
        </div>
        <div
          className="absolute inset-0 flex gap-0.5 overflow-hidden text-gold"
          style={{ width: `${percent}%` }}
        >
          {STAR_INDEXES.map((i) => (
            <Star key={i} width={size} height={size} fill="currentColor" stroke="none" />
          ))}
        </div>
      </div>
      <span className="sr-only">{rating.toFixed(1)} din 5 stele</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-ink-soft">({reviewCount})</span>
      )}
    </div>
  );
}
