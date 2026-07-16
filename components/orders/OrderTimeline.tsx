import { Check, X } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import { TRACKING_STAGES, STATUS_META } from "@/lib/orders/status";

type StatusEvent = { status: OrderStatus; at: Date };

function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderTimeline({
  status,
  statusHistory,
  createdAt,
}: {
  status: OrderStatus;
  statusHistory: StatusEvent[];
  createdAt: Date;
}) {
  // Ultimul timestamp pentru fiecare status din istoric.
  const timestamps = new Map<OrderStatus, Date>();
  timestamps.set("PENDING", createdAt);
  for (const event of statusHistory) {
    timestamps.set(event.status, event.at);
  }

  if (status === "CANCELLED") {
    return (
      <ol className="space-y-0">
        <li className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta text-cream">
            <X className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="pb-2">
            <p className="font-semibold text-ink">{STATUS_META.CANCELLED.customerLabel}</p>
            <p className="text-sm text-ink-soft">{STATUS_META.CANCELLED.description}</p>
          </div>
        </li>
      </ol>
    );
  }

  const currentIndex = TRACKING_STAGES.indexOf(status);

  return (
    <ol className="space-y-0">
      {TRACKING_STAGES.map((stage, index) => {
        const done = index <= currentIndex;
        const isLast = index === TRACKING_STAGES.length - 1;
        const meta = STATUS_META[stage];
        const at = timestamps.get(stage);

        return (
          <li key={stage} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                  done ? "bg-green-500 text-white" : "border-2 border-border bg-card text-ink-soft"
                }`}
              >
                {done ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
                )}
              </span>
              {!isLast && (
                <span
                  className={`w-0.5 flex-1 ${done && index < currentIndex ? "bg-green-500" : "bg-border"}`}
                  style={{ minHeight: "1.75rem" }}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className={isLast ? "pb-1" : "pb-6"}>
              <p className={`font-semibold ${done ? "text-ink" : "text-ink-soft"}`}>
                {meta.customerLabel}
              </p>
              <p className="text-sm text-ink-soft">{meta.description}</p>
              {done && at && (
                <p className="mt-0.5 text-xs text-ink-soft/80">{formatDateTime(at)}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
