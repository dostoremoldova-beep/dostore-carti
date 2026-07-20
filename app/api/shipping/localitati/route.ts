import { NextResponse } from "next/server";
import { listCities } from "@/lib/shipping/fan";
import { normalizeForSearch } from "@/lib/slugify";

// Sugestii de localități pentru checkout, din lista oficială FAN Courier.
// Lista e cache-uită în proces (24h) de `listCities`, deci nu lovim FAN la
// fiecare tastă. Căutarea ignoră diacriticele — clienții scriu „Balti", nu „Bălți".

export const runtime = "nodejs";

const MAX_RESULTS = 8;

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) return NextResponse.json({ results: [] });

  const needle = normalizeForSearch(query);
  const cities = await listCities();

  const scored = cities
    .map((city) => {
      const name = normalizeForSearch(city.name);
      if (name.startsWith(needle)) return { city, score: 2 };
      if (name.includes(needle)) return { city, score: 1 };
      return null;
    })
    .filter((entry): entry is { city: (typeof cities)[number]; score: number } => entry !== null)
    .sort((a, b) => b.score - a.score || a.city.name.localeCompare(b.city.name, "ro"))
    .slice(0, MAX_RESULTS);

  return NextResponse.json({
    results: scored.map(({ city }) => ({
      city: city.name,
      county: city.province,
      label: `${city.name}, ${city.province}`,
    })),
  });
}
