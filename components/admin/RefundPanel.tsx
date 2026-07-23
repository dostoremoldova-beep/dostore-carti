"use client";

import { useActionState } from "react";
import { Undo2, AlertTriangle } from "lucide-react";
import { refundOrder, type RefundState } from "@/lib/actions/admin-refund";

/**
 * Returnare bani către client (VictoriaBank). Apare doar la comenzile plătite
 * online. Avertizează explicit că banca permite o singură returnare.
 */
export function RefundPanel({
  orderId,
  total,
  paymentStatus,
  hasPaymentReference,
}: {
  orderId: string;
  total: number;
  paymentStatus: string;
  hasPaymentReference: boolean;
}) {
  const [state, action, pending] = useActionState(refundOrder.bind(null, orderId), {
    status: "idle",
  } as RefundState);

  if (paymentStatus === "REFUNDED") {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-1 flex items-center gap-2 font-semibold text-slate-900">
          <Undo2 className="h-4.5 w-4.5 text-slate-400" aria-hidden="true" />
          Returnare bani
        </h2>
        <p className="text-sm text-emerald-700">Banii au fost returnați clientului.</p>
      </section>
    );
  }

  if (paymentStatus !== "PAID") return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
        <Undo2 className="h-4.5 w-4.5 text-slate-400" aria-hidden="true" />
        Returnare bani
      </h2>

      <p className="mb-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Banca permite <strong>o singură returnare</strong> per plată. După o returnare
        parțială, restul nu mai poate fi returnat automat. Stabilește suma corect din
        prima.
      </p>

      {state.status === "error" && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      )}
      {state.status === "success" && (
        <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          {state.message}
        </p>
      )}

      {!hasPaymentReference ? (
        <p className="text-sm text-slate-500">
          Lipsește referința de plată de la bancă — returnarea se face manual, din contul
          VictoriaBank.
        </p>
      ) : (
        <form action={action} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Sumă de returnat (lei)
            </label>
            <input
              name="amount"
              inputMode="decimal"
              placeholder={`gol = tot (${total.toFixed(2)} lei)`}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Lasă gol pentru returnare integrală.
            </p>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {pending ? "Se procesează…" : "Returnează banii"}
          </button>
        </form>
      )}
    </section>
  );
}
