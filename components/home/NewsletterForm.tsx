"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { subscribeNewsletter, type NewsletterState } from "@/lib/actions/newsletter";

const initialState: NewsletterState = { status: "idle", message: "" };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-gold">
          <Mail className="h-5.5 w-5.5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-serif text-2xl font-semibold text-cream sm:text-3xl">
          Fii primul care află de noutăți
        </h2>
        <p className="mt-2 text-cream/70">
          Abonează-te și primești recomandări de carte și oferte exclusive, direct pe email.
        </p>

        <form
          action={formAction}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Adresa ta de email
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            placeholder="adresa@email.com"
            className="w-full flex-1 rounded-full border border-cream/20 bg-cream/5 px-5 py-3 text-sm text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-terracotta-dark disabled:opacity-60"
          >
            {pending ? "Se trimite..." : "Abonează-te"}
          </button>
        </form>

        {state.message && (
          <p
            role="status"
            aria-live="polite"
            className={`mt-3 text-sm font-medium ${
              state.status === "success" ? "text-gold" : "text-red-300"
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
    </section>
  );
}
