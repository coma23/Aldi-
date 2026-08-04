import Link from "next/link";
import type { Metadata } from "next";
import { PhotoCard } from "@/components/photo-card";
import { getCategories, getCountries, getPhotos } from "@/lib/data";
import { cn } from "@/lib/cn";
import { masonrySpan, MASONRY_ROW_PX } from "@/lib/masonry";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explora el portfolio completo por categoría o por país.",
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; pais?: string }>;
}) {
  const { categoria, pais } = await searchParams;

  const [photos, categories, countries] = await Promise.all([
    getPhotos({ categorySlug: categoria, countrySlug: pais }),
    getCategories(),
    getCountries(),
  ]);

  const activeCountry = pais
    ? countries.find((c) => c.slug === pais)
    : undefined;

  function hrefFor(next: { categoria?: string; pais?: string }) {
    const params = new URLSearchParams();
    if (next.categoria) params.set("categoria", next.categoria);
    if (next.pais) params.set("pais", next.pais);
    const qs = params.toString();
    return qs ? `/portfolio?${qs}` : "/portfolio";
  }

  return (
    <div className="container-page pb-24 pt-32 sm:pt-40">
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
          Portfolio
        </p>
        <h1 className="font-display text-5xl sm:text-6xl">
          {activeCountry ? activeCountry.name : "Todo el trabajo"}
        </h1>
        {activeCountry && (
          <p className="mt-4 text-paper/60">{activeCountry.description}</p>
        )}
      </header>

      <div className="mb-10 flex flex-wrap items-center gap-x-2 gap-y-3 border-b border-line pb-8">
        <Link
          href={hrefFor({ pais })}
          className={cn(
            "px-3 py-1.5 text-xs uppercase tracking-wide transition",
            !categoria
              ? "bg-paper text-ink"
              : "text-paper/60 hover:text-paper",
          )}
        >
          Todas
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={hrefFor({ categoria: category.slug, pais })}
            className={cn(
              "px-3 py-1.5 text-xs uppercase tracking-wide transition",
              categoria === category.slug
                ? "bg-paper text-ink"
                : "text-paper/60 hover:text-paper",
            )}
          >
            {category.name}
          </Link>
        ))}

        {activeCountry && (
          <Link
            href={hrefFor({ categoria })}
            className="ml-auto flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-wide text-accent hover:text-paper"
          >
            Quitar filtro de país ×
          </Link>
        )}
      </div>

      {photos.length === 0 ? (
        <p className="py-24 text-center text-paper/50">
          No hay fotografías para este filtro todavía.
        </p>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gridAutoRows: `${MASONRY_ROW_PX}px`,
          }}
        >
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              style={{ gridRowEnd: `span ${masonrySpan(photo.width, photo.height)}` }}
            >
              <PhotoCard photo={photo} priority={i < 3} fillCell />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
