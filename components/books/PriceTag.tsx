import { formatPrice } from "@/lib/format";

export function PriceTag({
  price,
  discountPrice,
  size = "md",
}: {
  price: number;
  discountPrice?: number | null;
  size?: "sm" | "md" | "lg";
}) {
  const hasDiscount = discountPrice != null && discountPrice < price;
  const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";
  const oldTextSize = size === "lg" ? "text-base" : "text-xs";

  if (!hasDiscount) {
    return <span className={`font-semibold text-ink ${textSize}`}>{formatPrice(price)}</span>;
  }

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`font-semibold text-terracotta ${textSize}`}>
        {formatPrice(discountPrice)}
      </span>
      <span className={`text-ink-soft line-through ${oldTextSize}`}>{formatPrice(price)}</span>
    </div>
  );
}
