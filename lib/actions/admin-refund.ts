"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { refundPayment } from "@/lib/payments/victoriabank";

export type RefundState = {
  status: "idle" | "error" | "success";
  message?: string;
};

/**
 * Returnează banii pentru o comandă plătită online.
 *
 * ⚠️ Banca permite O SINGURĂ returnare per tranzacție. După o returnare
 * parțială, restul NU mai poate fi returnat prin API. De aceea confirmăm suma
 * o singură dată și marcăm comanda ca REFUNDED.
 */
export async function refundOrder(
  orderId: string,
  _prev: RefundState,
  formData: FormData
): Promise<RefundState> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { status: "error", message: "Comanda nu există." };

  if (order.paymentStatus !== "PAID") {
    return { status: "error", message: "Doar comenzile plătite online pot fi returnate." };
  }
  if (!order.paymentId) {
    return {
      status: "error",
      message: "Lipsește referința de plată de la bancă — returnarea nu se poate face automat.",
    };
  }

  // Suma: gol/0 = returnare integrală; altfel returnare parțială.
  const raw = String(formData.get("amount") ?? "").trim().replace(",", ".");
  const parsed = raw ? Number(raw) : 0;
  if (raw && (!Number.isFinite(parsed) || parsed <= 0)) {
    return { status: "error", message: "Suma introdusă nu e validă." };
  }
  if (parsed > order.total) {
    return {
      status: "error",
      message: `Suma depășește totalul comenzii (${order.total.toFixed(2)} lei).`,
    };
  }

  const isPartial = parsed > 0 && parsed < order.total;
  const result = await refundPayment(order.paymentId, isPartial ? parsed : undefined);
  if (!result.ok) return { status: "error", message: result.message };

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "REFUNDED",
      status: order.status === "CANCELLED" ? order.status : "CANCELLED",
    },
  });

  revalidatePath(`/admin/comenzi/${order.id}`);
  revalidatePath(`/comanda/${order.orderNumber}`);

  return { status: "success", message: result.message };
}
