import { NextResponse } from "next/server";
import { confirmOrderPayment } from "@/lib/payments/confirm";

// Pagina de plată interoghează acest endpoint în buclă. El întreabă banca
// (server-side, autentificat) și, dacă plata e confirmată, marchează comanda.
export const runtime = "nodejs";

export async function GET(request: Request) {
  const order = new URL(request.url).searchParams.get("order");
  if (!order) return NextResponse.json({ status: "failed" }, { status: 400 });

  const status = await confirmOrderPayment(order);
  return NextResponse.json({ status });
}
