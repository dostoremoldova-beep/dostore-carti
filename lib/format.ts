export function formatPrice(amount: number): string {
  return `${new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)} lei`;
}

export function formatBookCount(count: number): string {
  return `${count} ${count === 1 ? "carte" : "cărți"}`;
}
