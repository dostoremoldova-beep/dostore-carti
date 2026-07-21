import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { PaymentQr } from "@/components/checkout/PaymentQr";

export const metadata: Metadata = { title: "Plată prin QR" };

type PageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function PaymentPage({ searchParams }: PageProps) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) notFound();

  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) notFound();

  // Deja plătită, sau comandă pe ramburs (fără QR) → mergem la succes.
  if (order.paymentStatus === "PAID" || !order.qrPayUrl) {
    redirect(`/checkout/succes?order=${orderNumber}`);
  }

  // Generăm imaginea QR din payload-ul băncii (docs: qrAsText poate fi encodat
  // în propria imagine). Un data URL SVG e clar și ușor.
  const qrDataUrl = await QRCode.toDataURL(order.qrPayUrl, {
    width: 320,
    margin: 1,
    color: { dark: "#1a1a2e", light: "#ffffff" },
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center font-serif text-3xl font-semibold text-ink">
        Scanează pentru a plăti
      </h1>
      <p className="mt-2 text-center text-ink-soft">
        Comanda <span className="font-semibold text-ink">{orderNumber}</span> ·{" "}
        <span className="font-semibold text-ink">{order.total.toFixed(2)} lei</span>
      </p>

      <PaymentQr orderNumber={orderNumber} qrDataUrl={qrDataUrl} payUrl={order.qrPayUrl} />
    </div>
  );
}
