import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { WorldMap } from "@/components/world-map";
import { getCountriesWithCounts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Países visitados",
  description:
    "Mapa interactivo de los países fotografiados. Haz clic en un país para ver sus fotografías.",
};

export default async function CountriesPage() {
  const countries = await getCountriesWithCounts();

  const mapCountries = countries.map((c) => ({
    slug: c.slug,
    name: c.name,
    isoCode: c.isoCode,
    photoCount: c._count.photos,
  }));

  return (
    <div className="pb-24 pt-32 sm:pt-40">
      <header className="container-page mb-12 max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
          {countries.length} países
        </p>
        <h1 className="font-display text-5xl sm:text-6xl">
          Un mapa de historias
        </h1>
        <p className="mt-4 text-paper/60">
          Haz clic en cualquier país destacado para ver las fotografías
          tomadas allí.
        </p>
      </header>

      <div className="container-page">
        <WorldMap countries={mapCountries} />
      </div>

      <div className="container-page mt-16 grid gap-px overflow-hidden bg-line sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <Link
            key={country.slug}
            href={`/portfolio?pais=${country.slug}`}
            className="group flex flex-col justify-between gap-6 bg-surface p-8"
          >
            <div>
              <p className="font-display text-2xl transition group-hover:text-accent">
                {country.name}
              </p>
              <p className="mt-2 text-sm text-paper/60">
                {country.description}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-paper/40">
              <span>{country._count.photos} fotografías</span>
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1 group-hover:text-accent"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
