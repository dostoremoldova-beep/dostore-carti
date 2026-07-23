"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "dostore-cookie-consent";

/**
 * Banner de consimțământ pentru cookie-uri.
 *
 * Alegerea se ține în localStorage. Cât timp nu există o alegere, analytics-ul
 * NU pornește (vezi DeferredAnalytics, care citește aceeași cheie) — asta e
 * cerința legală: cookie-urile ne-esențiale se încarcă doar după accept.
 * Cookie-urile strict necesare (coș, sesiune admin) funcționează oricum.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Citim după montare ca să nu producem hydration mismatch (localStorage nu
    // există pe server, deci nu putem decide vizibilitatea la randare).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- citire din localStorage post-montare
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function choose(value: "accepted" | "rejected") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    // Anunțăm restul aplicației (analytics) fără reîncărcare.
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consimțământ cookie-uri"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-2xl sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-sm sm:rounded-xl sm:border"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-soft text-terracotta">
          <Cookie className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-ink">Folosim cookie-uri</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Unele sunt necesare ca site-ul să funcționeze (coșul, comanda). Altele ne
            ajută să vedem ce pagini sunt utile. Alegi tu.{" "}
            <Link href="/confidentialitate" className="font-medium text-terracotta underline">
              Detalii
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="flex-1 rounded-full bg-terracotta px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-terracotta-dark"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("rejected")}
          className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          Doar necesare
        </button>
      </div>
    </div>
  );
}
