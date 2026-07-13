import { prisma } from "@/lib/prisma";

export function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getPopularCategories(limit = 6) {
  const categories = await getAllCategories();
  return categories.slice(0, limit);
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
