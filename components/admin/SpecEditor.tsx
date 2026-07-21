"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export type SpecDraft = { label: string; value: string };

/**
 * Editor de specificații produs (etichetă + valoare), trimise ca un singur câmp
 * JSON (`specs`). Ex: „Vârstă"→„12+", „Pagini"→„300", „Categorie"→„Istorie".
 * Rândurile goale sunt ignorate la salvare.
 */
export function SpecEditor({ initialSpecs = [] }: { initialSpecs?: SpecDraft[] }) {
  const [specs, setSpecs] = useState<SpecDraft[]>(initialSpecs);

  function update(index: number, patch: Partial<SpecDraft>) {
    setSpecs((current) => current.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  return (
    <div className="space-y-2.5">
      <input type="hidden" name="specs" value={JSON.stringify(specs)} />

      {specs.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 px-4 py-5 text-center text-sm text-slate-500">
          Nicio specificație. Ex: Vârstă → 12+, Pagini → 300, Categorie → Istorie.
        </p>
      )}

      {specs.map((spec, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={spec.label}
            onChange={(e) => update(index, { label: e.target.value })}
            placeholder="Etichetă (ex: Vârstă)"
            className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
          <span className="text-slate-400">→</span>
          <input
            value={spec.value}
            onChange={(e) => update(index, { value: e.target.value })}
            placeholder="Valoare (ex: 12+)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setSpecs((c) => c.filter((_, i) => i !== index))}
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Șterge specificația"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setSpecs((c) => [...c, { label: "", value: "" }])}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-900 hover:text-slate-900"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Adaugă o specificație
      </button>
    </div>
  );
}
