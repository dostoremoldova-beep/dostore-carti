import type { OrderStatus } from "@prisma/client";

// Etapele liniare ale livrării, în ordine. CANCELLED nu face parte din timeline.
export const TRACKING_STAGES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

type StatusMeta = {
  /** Eticheta scurtă din admin (badge). */
  label: string;
  /** Titlul etapei pe pagina publică de tracking. */
  customerLabel: string;
  /** Descrierea etapei pe pagina publică. */
  description: string;
};

export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  PENDING: {
    label: "În așteptare",
    customerLabel: "Comandă plasată",
    description: "Am primit comanda ta și o pregătim.",
  },
  CONFIRMED: {
    label: "Confirmată",
    customerLabel: "Plată confirmată",
    description: "Plata a fost confirmată cu succes.",
  },
  PROCESSING: {
    label: "În procesare",
    customerLabel: "Se ambalează",
    description: "Îți împachetăm cărțile cu grijă.",
  },
  SHIPPED: {
    label: "Expediată",
    customerLabel: "Pe drum spre tine",
    description: "Comanda a fost predată curierului și e pe drum.",
  },
  DELIVERED: {
    label: "Livrată",
    customerLabel: "Livrată cu succes",
    description: "Comanda a ajuns la tine. Lectură plăcută!",
  },
  CANCELLED: {
    label: "Anulată",
    customerLabel: "Comandă anulată",
    description: "Comanda a fost anulată. Pentru detalii, contactează-ne.",
  },
};

// Copy pentru emailul trimis la schimbarea statusului. Doar stadiile care merită
// o notificare către client (nu trimitem la PENDING — ăla are deja confirmarea).
export const STATUS_EMAIL: Partial<
  Record<OrderStatus, { subject: (orderNumber: string) => string; heading: string; body: string }>
> = {
  CONFIRMED: {
    subject: (n) => `Plata confirmată — comanda ${n}`,
    heading: "Plata a fost confirmată ✅",
    body: "Am primit plata ta. Pregătim comanda și îți dăm de veste la fiecare pas.",
  },
  PROCESSING: {
    subject: (n) => `Comanda ${n} se ambalează`,
    heading: "Îți ambalăm comanda 📦",
    body: "Coletul tău se pregătește chiar acum și e aproape gata de livrare.",
  },
  SHIPPED: {
    subject: (n) => `Comanda ${n} e pe drum spre tine`,
    heading: "Comanda e pe drum 🚚",
    body: "Am predat coletul curierului. Ajunge la tine în cel mai scurt timp.",
  },
  DELIVERED: {
    subject: (n) => `Comanda ${n} a fost livrată`,
    heading: "Comanda a fost livrată 🎉",
    body: "Comanda ta a ajuns la destinație. Îți dorim lectură plăcută!",
  },
};

// Statusurile la care trimitem email de notificare clientului.
export function shouldEmailForStatus(status: OrderStatus): boolean {
  return status in STATUS_EMAIL;
}
