import { prisma } from "@/lib/prisma";
import type { Book } from "@prisma/client";

const SEARCH_INDEX_NAME = "default";
const SEARCH_PATHS = ["title", "author", "description", "tags"];

type SearchResult = {
  books: Book[];
  usedFallback: boolean;
};

function extractObjectId(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "$oid" in value) {
    const oid = (value as { $oid?: unknown }).$oid;
    return typeof oid === "string" ? oid : null;
  }
  return null;
}

async function atlasSearch(query: string, limit: number): Promise<Book[]> {
  const raw = await prisma.$runCommandRaw({
    aggregate: "Book",
    pipeline: [
      {
        $search: {
          index: SEARCH_INDEX_NAME,
          text: {
            query,
            path: SEARCH_PATHS,
            fuzzy: {},
          },
        },
      },
      { $limit: limit },
      { $project: { _id: 1 } },
    ],
    cursor: {},
  });

  const batch =
    (raw as { cursor?: { firstBatch?: unknown[] } })?.cursor?.firstBatch ?? [];

  const orderedIds = batch
    .map((doc) => extractObjectId((doc as { _id?: unknown })?._id))
    .filter((id): id is string => Boolean(id));

  if (orderedIds.length === 0) return [];

  const books = await prisma.book.findMany({ where: { id: { in: orderedIds } } });
  const byId = new Map(books.map((book) => [book.id, book]));

  return orderedIds
    .map((id) => byId.get(id))
    .filter((book): book is Book => Boolean(book));
}

async function fallbackSearch(query: string, limit: number): Promise<Book[]> {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return [];

  // Căutăm cărțile care conțin ORICARE cuvânt (case-insensitive) în searchText,
  // apoi le ordonăm după relevanță: potrivirile din titlu cântăresc mai mult.
  const candidates = await prisma.book.findMany({
    where: {
      OR: words.map((word) => ({
        searchText: { contains: word, mode: "insensitive" },
      })),
    },
    take: limit * 3,
  });

  return candidates
    .map((book) => {
      const haystack = book.searchText.toLowerCase();
      const titleHaystack = book.title.toLowerCase();
      const authorHaystack = book.author.toLowerCase();
      let score = 0;
      for (const word of words) {
        if (titleHaystack.includes(word)) score += 4;
        else if (authorHaystack.includes(word)) score += 3;
        else if (haystack.includes(word)) score += 1;
      }
      return { book, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.book);
}

export async function searchBooks(query: string, limit = 24): Promise<SearchResult> {
  const trimmed = query.trim();
  if (!trimmed) return { books: [], usedFallback: false };

  try {
    const books = await atlasSearch(trimmed, limit);
    // Dacă Atlas Search rulează dar nu întoarce nimic (index încă în construcție,
    // typo neacoperit sau mapare incompletă), mai încercăm căutarea simplă ca
    // să nu rămână utilizatorul cu „niciun rezultat" degeaba.
    if (books.length > 0) return { books, usedFallback: false };
    const fallback = await fallbackSearch(trimmed, limit);
    return { books: fallback, usedFallback: fallback.length > 0 };
  } catch (error) {
    console.error(
      "[search] Atlas Search a eșuat, trec pe căutarea simplă de rezervă:",
      error
    );
    const books = await fallbackSearch(trimmed, limit);
    return { books, usedFallback: true };
  }
}
