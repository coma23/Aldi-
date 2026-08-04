import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDownRight } from "lucide-react";
import { PhotoCard } from "@/components/photo-card";
import { getCategories, getFeaturedPhotos, getCountriesWithCounts } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

export default async function Home() {
  const [featured, categories, countries] = await Promise.all([
    getFeaturedPhotos(7),
    getCategories(),
    getCountriesWithCounts(),
  ]);

  const [hero, ...rest] = featured;

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-[92vh] min-h-[640px] w-full items-end overflow-hidden">
        {hero && (
          <Image
            src={hero.imageUrl}
            alt={hero.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-black/30" />
        <div className="container-page relative pb-20 sm:pb-24">
          <p
            className="animate-fade-up mb-4 text-xs uppercase tracking-[0.3em] text-paper/70"
            style={{ animationDelay: "0.1s" }}
          >
            {siteConfig.tagline}
          </p>
          <h1
            className="animate-fade-up max-w-4xl text-balance font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl"
            style={{ animationDelay: "0.25s" }}
          >
            Historias contadas en luz y silencio.
          </h1>
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-6"
            style={{ animationDelay: "0.45s" }}
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 bg-paper px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition hover:bg-accent"
            >
              Ver portfolio <ArrowRight size={16} />
            </Link>
            <Link
              href="/paises"
              className="link-underline inline-flex items-center gap-2 text-sm uppercase tracking-wide"
            >
              Explorar el mapa <ArrowDownRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <section className="container-page py-24 sm:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
              Colecciones
            </p>
            <h2 className="font-display text-4xl sm:text-5xl">
              Explora por categoría
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="link-underline hidden text-sm uppercase tracking-wide sm:block"
          >
            Ver todo el portfolio
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden bg-line sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/portfolio?categoria=${category.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-end bg-surface p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent transition group-hover:from-white/[0.06]" />
              <span className="relative font-display text-3xl transition group-hover:text-accent">
                {category.name}
              </span>
              <span className="relative mt-2 max-w-[26ch] text-sm text-paper/60">
                {category.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured photo grid */}
      {rest.length > 0 && (
        <section className="container-page pb-24 sm:pb-32">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
                Selección
              </p>
              <h2 className="font-display text-4xl sm:text-5xl">
                Trabajo destacado
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {rest.map((photo, i) => (
              <div
                key={photo.id}
                className={i === 0 ? "col-span-2 row-span-2" : ""}
              >
                <PhotoCard photo={photo} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About teaser */}
      <section className="border-y border-line bg-black/20">
        <div className="container-page grid gap-12 py-24 sm:py-32 lg:grid-cols-2 lg:items-center">
          <p className="text-balance font-display text-3xl leading-snug sm:text-4xl">
            Cada fotografía es el resultado de esperar la luz correcta, en el
            lugar correcto, el tiempo suficiente.
          </p>
          <div>
            <p className="max-w-md text-paper/70">
              Fotógrafo documental especializado en retrato, paisaje y
              arquitectura. Más de una década recorriendo el mundo con una
              cámara y la paciencia como principal herramienta.
            </p>
            <Link
              href="/sobre-mi"
              className="link-underline mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-wide"
            >
              Conoce mi historia <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Countries teaser */}
      <section className="container-page py-24 sm:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
              {countries.length} países
            </p>
            <h2 className="font-display text-4xl sm:text-5xl">
              Un mapa de historias
            </h2>
          </div>
          <Link
            href="/paises"
            className="link-underline inline-flex items-center gap-2 text-sm uppercase tracking-wide"
          >
            Ver mapa interactivo <ArrowRight size={16} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {countries.map((country) => (
            <Link
              key={country.slug}
              href={`/portfolio?pais=${country.slug}`}
              className="link-underline font-display text-2xl text-paper/70 hover:text-paper sm:text-3xl"
            >
              {country.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
