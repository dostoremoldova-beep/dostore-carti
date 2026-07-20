// Greutatea coletului, pentru tarifarea FAN Courier.
//
// Produsele pot să n-aibă `weightGrams` completat (câmpul e opțional în admin).
// Ca să nu blocăm comanda, cădem pe o estimare implicită — dar admin-ul e
// încurajat să completeze greutățile reale, altfel costul afișat e aproximativ.

/** Estimare pentru un produs fără greutate setată (o carte medie). */
export const DEFAULT_ITEM_WEIGHT_GRAMS = 400;

/** Ambalaj + material de protecție, adăugat o singură dată pe colet. */
export const PACKAGING_WEIGHT_GRAMS = 150;

/** FAN taxează minimum 1 kg (prima e inclusă în tarif). */
const MIN_BILLABLE_KG = 1;

export type WeighableItem = {
  quantity: number;
  weightGrams?: number | null;
};

/** Greutatea totală a coletului în kilograme, gata de trimis către FAN. */
export function calculateParcelWeightKg(items: WeighableItem[]): number {
  const itemsGrams = items.reduce(
    (sum, item) => sum + (item.weightGrams ?? DEFAULT_ITEM_WEIGHT_GRAMS) * item.quantity,
    0
  );

  const totalGrams = itemsGrams + PACKAGING_WEIGHT_GRAMS;
  const kg = totalGrams / 1000;

  // O zecimală e suficient pentru FAN și evită numere gen 1.5500000000000002.
  return Math.max(MIN_BILLABLE_KG, Math.round(kg * 10) / 10);
}
