"use client";

import { useState } from "react";
import { Plus, Trash2, Star } from "lucide-react";

export type ReviewDraft = {
  author: string;
  rating: number;
  text: string;
};

/**
 * Editor de recenzii pentru un produs. Trimite datele ca un singur câmp JSON
 * (`reviews`), pe care Server Action-ul îl parsează și din care recalculează
 * `rating` + `reviewCount`. Rândurile goale sunt ignorate la salvare.
 */
export function ReviewEditor({ initialReviews = [] }: { initialReviews?: ReviewDraft[] }) {
  const [reviews, setReviews] = useState<ReviewDraft[]>(initialReviews);

  function update(index: number, patch: Partial<ReviewDraft>) {
    setReviews((current) => current.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="reviews" value={JSON.stringify(reviews)} />

      {reviews.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
          Nicio recenzie încă.
        </p>
      )}

      {reviews.map((review, index) => (
        <div key={index} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="mb-2 flex items-center gap-3">
            <input
              value={review.author}
              onChange={(e) => update(index, { author: e.target.value })}
              placeholder="Nume (ex: Maria P.)"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-900 focus:outline-none"
            />
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => update(index, { rating: star })}
                  aria-label={`${star} stele`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setReviews((c) => c.filter((_, i) => i !== index))}
              className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Șterge recenzia"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea
            value={review.text}
            onChange={(e) => update(index, { text: e.target.value })}
            rows={2}
            placeholder="Textul recenziei"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => setReviews((c) => [...c, { author: "", rating: 5, text: "" }])}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-900 hover:text-slate-900"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Adaugă o recenzie
      </button>
    </div>
  );
}
