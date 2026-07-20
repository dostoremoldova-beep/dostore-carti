import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCallback } from "@/lib/payments/victoriabank";
import { sendPaymentConfirmedEmail } from "@/lib/email/notifications";
import { tgPaymentConfirmed } from "@/lib/telegram";

// Callback de la VictoriaBank (MIA): banca ne anunță că plata s-a făcut.
// Rulează pe Node.js (are nevoie de crypto pentru verificarea semnăturii).
export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  // Numele header-ului de semnătură se confirmă din spec; acceptăm variantele uzuale.
  const signature =
    request.headers.get("x-signature") ??
    request.headers.get("signature") ??
    request.headers.get("x-mia-signature");

  const result = await verifyCallback(rawBody, signature);

  // Semnătură invalidă sau necredentiat: răspundem 200 ca banca să nu reîncerce
  // la nesfârșit, dar NU atingem comanda (exact ca la maib — fără oracol).
  if (!result) {
    return NextResponse.json({ ok: true });
  }

  if (!result.paid || !result.orderNumber) {
    return NextResponse.json({ ok: true });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: result.orderNumber },
  });
  if (!order) return NextResponse.json({ ok: true });

  // Gardă de idempotență: banca poate re-trimite callback-ul. Emailul/Telegram
  // de confirmare pleacă o singură dată.
  const wasAlreadyPaid = order.paymentStatus === "PAID";

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "PAID",
      status: order.status === "PENDING" ? "CONFIRMED" : order.status,
      paymentId: result.paymentId || order.paymentId,
    },
  });

  if (!wasAlreadyPaid) {
    await Promise.allSettled([
      sendPaymentConfirmedEmail({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderNumber: order.orderNumber,
        total: order.total,
      }),
      tgPaymentConfirmed({ orderNumber: order.orderNumber, total: order.total }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
