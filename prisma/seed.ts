import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { CATEGORIES, PHOTOS } from "../src/lib/seed-data";
import { FEATURED_COUNTRIES } from "../src/lib/countries-geo";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.priceOption.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.category.deleteMany();
  await prisma.country.deleteMany();

  const categoryIdBySlug = new Map<string, string>();
  for (const category of CATEGORIES) {
    const created = await prisma.category.create({ data: category });
    categoryIdBySlug.set(category.slug, created.id);
  }

  const countryIdBySlug = new Map<string, string>();
  for (const country of FEATURED_COUNTRIES) {
    const created = await prisma.country.create({ data: { ...country } });
    countryIdBySlug.set(country.slug, created.id);
  }

  for (const photo of PHOTOS) {
    const categoryId = categoryIdBySlug.get(photo.category);
    const countryId = countryIdBySlug.get(photo.country);
    if (!categoryId || !countryId) {
      throw new Error(`Missing category/country for photo ${photo.slug}`);
    }

    await prisma.photo.create({
      data: {
        slug: photo.slug,
        title: photo.title,
        description: photo.description,
        location: photo.location,
        capturedAt: new Date(photo.capturedAt),
        imageUrl: `/photos/${photo.slug}.svg`,
        width: photo.width,
        height: photo.height,
        featured: photo.featured,
        categoryId,
        countryId,
        prices: {
          create: photo.prices.map((price, index) => ({
            ...price,
            sortOrder: index,
          })),
        },
      },
    });
  }

  console.log(
    `Seeded ${CATEGORIES.length} categories, ${FEATURED_COUNTRIES.length} countries, ${PHOTOS.length} photos.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
