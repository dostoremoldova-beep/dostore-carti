import "server-only";

// ─────────────────────────────────────────────────────────────────────────────
// Integrare plată VictoriaBank — MIA (Moldova Instant Payments).
//
// Fluxul cerut: la finalizarea comenzii se generează un link + cod QR de plată;
// clientul plătește în aplicația lui de banking, iar banca ne trimite un
// callback de confirmare. Ăsta e sistemul MIA (plăți instant prin QR/link),
// nu plata clasică cu card (VPOS).
//
// ⚠️ STARE: schelet funcțional, în așteptarea credențialelor + specificației
// oficiale de la VictoriaBank (Card.Acceptare@vb.md / API-ul Business IPS).
// Endpoint-urile și numele de câmpuri de mai jos sunt PLACEHOLDER, izolate în
// blocul CONFIG ca să le completezi într-un singur loc când primești docs.
//
// Ca la maib/FAN/email: fără credențiale reale intrăm în mod no-op — plata se
// consideră „de achitat la livrare" și comanda merge mai departe, ca site-ul
// să funcționeze până la go-live.
// ─────────────────────────────────────────────────────────────────────────────

// ┌── CONFIG: singurul loc de completat după ce primești documentația MIA ──┐
const CONFIG = {
  // Bază API (sandbox vs producție vin din docs).
  baseUrl: process.env.VB_MIA_BASE_URL ?? "https://ipspj.victoriabank.md/api",
  // OAuth2 client_credentials pentru API-ul Business IPS.
  clientId: process.env.VB_MIA_CLIENT_ID,
  clientSecret: process.env.VB_MIA_CLIENT_SECRET,
  // ID-ul de comerciant / terminal alocat de bancă.
  merchantId: process.env.VB_MIA_MERCHANT_ID,
  // Cheia cu care banca semnează callback-urile (verificare semnătură).
  signatureKey: process.env.VB_MIA_SIGNATURE_KEY,
  // Rute concrete — de confirmat din spec.
  tokenPath: "/oauth/token",
  createPaymentPath: "/v2/payments",
  statusPath: (id: string) => `/v2/payments/${id}`,
};
// └────────────────────────────────────────────────────────────────────────┘

export const isVictoriaBankConfigured = Boolean(
  CONFIG.clientId && CONFIG.clientSecret && CONFIG.merchantId
);

export type CreatePaymentInput = {
  orderNumber: string;
  amount: number; // în MDL
  description: string;
  callbackUrl: string; // unde ne notifică banca
  returnUrl: string; // unde revine clientul după plată
};

export type PaymentSession = {
  paymentId: string;
  /** Link către pagina/aplicația de plată (redirect direct). */
  payUrl: string;
  /** Payload-ul pentru codul QR (dacă vrei să-l afișezi pe site). */
  qrData?: string;
  /** true în mod no-op — apelantul trece pe fluxul ramburs. */
  skipped?: boolean;
};

// Token OAuth cachat, refolosit până aproape de expirare.
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt - 30_000 > now) return tokenCache.token;

  const res = await fetch(`${CONFIG.baseUrl}${CONFIG.tokenPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CONFIG.clientId!,
      client_secret: CONFIG.clientSecret!,
    }),
  });

  if (!res.ok) {
    throw new Error(`VictoriaBank: obținerea token-ului a eșuat (${res.status})`);
  }

  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("VictoriaBank: răspuns fără access_token.");

  tokenCache = {
    token: data.access_token,
    expiresAt: now + (data.expires_in ?? 300) * 1000,
  };
  return tokenCache.token;
}

/**
 * Creează sesiunea de plată MIA. Fără credențiale întoarce `{ skipped: true }`,
 * iar checkout-ul continuă pe ramburs. NU aruncă pe calea no-op.
 */
export async function createPayment(input: CreatePaymentInput): Promise<PaymentSession> {
  if (!isVictoriaBankConfigured) {
    console.info(
      `[victoriabank] SKIP (necredentiat) → comanda ${input.orderNumber} merge pe ramburs`
    );
    return { paymentId: "", payUrl: input.returnUrl, skipped: true };
  }

  const token = await getAccessToken();

  const res = await fetch(`${CONFIG.baseUrl}${CONFIG.createPaymentPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      merchantId: CONFIG.merchantId,
      amount: input.amount,
      currency: "MDL",
      orderId: input.orderNumber,
      description: input.description,
      callbackUrl: input.callbackUrl,
      returnUrl: input.returnUrl,
    }),
  });

  if (!res.ok) {
    throw new Error(`VictoriaBank: crearea plății a eșuat (${res.status})`);
  }

  // Numele de câmpuri din răspuns — de aliniat la spec când vine.
  const data = (await res.json()) as {
    id?: string;
    paymentId?: string;
    payUrl?: string;
    paymentUrl?: string;
    qr?: string;
    qrCode?: string;
  };

  const paymentId = data.paymentId ?? data.id ?? "";
  const payUrl = data.payUrl ?? data.paymentUrl ?? input.returnUrl;

  return { paymentId, payUrl, qrData: data.qrCode ?? data.qr };
}

export type CallbackResult = {
  orderNumber: string;
  paid: boolean;
  paymentId: string;
};

/**
 * Validează și interpretează callback-ul băncii. La fel ca la maib, semnătura
 * se verifică ÎNAINTE de a atinge comanda — un callback nesemnat corect nu
 * trebuie să marcheze nimic plătit. Întoarce null dacă semnătura e invalidă.
 */
export async function verifyCallback(
  rawBody: string,
  signature: string | null
): Promise<CallbackResult | null> {
  if (!CONFIG.signatureKey) {
    console.warn("[victoriabank] callback fără cheie de semnătură configurată — ignorat.");
    return null;
  }

  // TODO(spec): algoritmul exact de semnătură MIA (HMAC? RSA? ce câmpuri intră)
  // se confirmă din documentație. Deliberat NU acceptăm callback-uri până atunci.
  const crypto = await import("node:crypto");
  const expected = crypto
    .createHmac("sha256", CONFIG.signatureKey)
    .update(rawBody)
    .digest("hex");

  if (!signature || signature !== expected) {
    console.error("[victoriabank] semnătură callback invalidă — respins.");
    return null;
  }

  const data = JSON.parse(rawBody) as {
    orderId?: string;
    status?: string;
    paymentId?: string;
  };

  return {
    orderNumber: String(data.orderId ?? ""),
    paid: data.status === "PAID" || data.status === "SUCCESS",
    paymentId: String(data.paymentId ?? ""),
  };
}
