"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

/**
 * Analytics + Speed Insights, montate DUPĂ ce pagina a devenit interactivă.
 *
 * Montate direct în layout, scripturile lor concurau cu hidratarea React pe
 * main thread și amânau desenarea hero-ului (element LCP). Le pornim la primul
 * moment de inactivitate al browserului (`requestIdleCallback`, cu fallback pe
 * timeout) — colectarea de date rămâne completă, dar nu mai fură din timpul de
 * randare inițial.
 */
export function DeferredAnalytics() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Cerință legală: analytics-ul pornește DOAR dacă vizitatorul a acceptat
    // cookie-urile (vezi CookieConsent). Fără accept, nu încărcăm nimic.
    const hasConsent = () => localStorage.getItem("dostore-cookie-consent") === "accepted";

    const start = () => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500));
      idle(() => setReady(true));
    };

    if (hasConsent()) {
      start();
      return;
    }

    // Dacă acceptă mai târziu din banner, pornim fără reîncărcare.
    const onConsent = (e: Event) => {
      if ((e as CustomEvent<string>).detail === "accepted") start();
    };
    window.addEventListener("cookie-consent", onConsent);
    return () => window.removeEventListener("cookie-consent", onConsent);
  }, []);

  if (!ready) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
