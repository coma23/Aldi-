import { prisma } from "@/lib/db";

export function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export function getCountries() {
  return prisma.country.findMany({ orderBy: { name: "asc" } });
}

export async function getCountriesWithCounts() {
  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { photos: true } } },
  });
  return countries;
}

export function getFeaturedPhotos(take = 6) {
  return prisma.photo.findMany({
    where: { featured: true },
    orderBy: { sortOrder: "asc" },
    take,
    include: { category: true, country: true },
  });
}

export function getPhotos(filters: {
  categorySlug?: string;
  countrySlug?: string;
}) {
  return prisma.photo.findMany({
    where: {
      category: filters.categorySlug
        ? { slug: filters.categorySlug }
        : undefined,
      country: filters.countrySlug
        ? { slug: filters.countrySlug }
        : undefined,
    },
    orderBy: [{ sortOrder: "asc" }, { capturedAt: "desc" }],
    include: { category: true, country: true },
  });
}

export function getPhotoBySlug(slug: string) {
  return prisma.photo.findUnique({
    where: { slug },
    include: { category: true, country: true, prices: { orderBy: { sortOrder: "asc" } } },
  });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function getCountryBySlug(slug: string) {
  return prisma.country.findUnique({ where: { slug } });
}

export async function getRelatedPhotos(photoId: string, categoryId: string, take = 4) {
  return prisma.photo.findMany({
    where: { categoryId, id: { not: photoId } },
    take,
    orderBy: { sortOrder: "asc" },
    include: { category: true, country: true },
  });
}
