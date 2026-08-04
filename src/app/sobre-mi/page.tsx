import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: `Conoce la historia detrás de ${siteConfig.fullName}.`,
};

const TIMELINE = [
  {
    year: "2014",
    title: "Los inicios",
    description:
      "Primera cámara réflex y los primeros retratos en blanco y negro, revelados en un cuarto oscuro prestado.",
  },
  {
    year: "2017",
    title: "El primer viaje largo",
    description:
      "Tres meses recorriendo el sur de Europa documentando arquitectura y vida cotidiana. Nace el archivo que hoy es este portfolio.",
  },
  {
    year: "2020",
    title: "Primera exposición",
    description:
      "Muestra colectiva de paisaje y retrato documental en una galería independiente.",
  },
  {
    year: "2023",
    title: "Impresiones fine art",
    description:
      "Se abre la tienda: impresiones numeradas y descargas digitales de todo el archivo internacional.",
  },
];

const EQUIPMENT = [
  "Cámara full-frame mirrorless",
  "35mm f/1.4 y 85mm f/1.8",
  "Trípode de fibra de carbono para largas exposiciones",
  "Flujo de trabajo en RAW con revelado manual, sin presets",
];

export default async function AboutPage() {
  const [photoCount, countryCount] = await Promise.all([
    prisma.photo.count(),
    prisma.country.count(),
  ]);

  return (
    <div className="pt-24 sm:pt-28">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:h-[calc(100vh-7rem)]">
          <Image
            src="/photos/autor.svg"
            alt={siteConfig.fullName}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="container-page py-12 lg:px-16 lg:py-0">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
            Sobre mí
          </p>
          <h1 className="text-balance font-display text-4xl leading-tight sm:text-5xl">
            Fotografío el mundo tal y como me hace sentir, no solo cómo se
            ve.
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-paper/70">
            Soy fotógrafo documental especializado en retrato, paisaje y
            arquitectura. Durante la última década he recorrido más de una
            decena de países con una sola regla: esperar a que la luz cuente
            la historia por mí. Cada imagen de este archivo es un instante
            que no volverá a repetirse.
          </p>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-y border-line py-6">
            <div>
              <p className="font-display text-3xl">{countryCount}</p>
              <p className="text-xs uppercase tracking-wide text-paper/50">
                Países
              </p>
            </div>
            <div>
              <p className="font-display text-3xl">{photoCount}</p>
              <p className="text-xs uppercase tracking-wide text-paper/50">
                Fotografías
              </p>
            </div>
            <div>
              <p className="font-display text-3xl">10+</p>
              <p className="text-xs uppercase tracking-wide text-paper/50">
                Años
              </p>
            </div>
          </div>

          <Link
            href="/portfolio"
            className="mt-10 inline-flex items-center gap-2 bg-paper px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition hover:bg-accent"
          >
            Ver el portfolio <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-black/20 py-24 sm:py-32">
        <div className="container-page">
          <p className="text-balance max-w-3xl font-display text-2xl leading-snug sm:text-3xl">
            &ldquo;No busco la foto perfecta. Busco el momento en el que el
            lugar deja de ser un decorado y se convierte en un
            recuerdo.&rdquo;
          </p>
        </div>
      </section>

      <section className="container-page py-24 sm:py-32">
        <h2 className="mb-12 font-display text-4xl sm:text-5xl">Trayectoria</h2>
        <div className="grid gap-10 sm:grid-cols-2">
          {TIMELINE.map((item) => (
            <div key={item.year} className="border-t border-line pt-6">
              <p className="font-mono text-sm text-accent">{item.year}</p>
              <h3 className="mt-2 font-display text-2xl">{item.title}</h3>
              <p className="mt-2 text-paper/60">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl">Equipo</h2>
            <ul className="mt-8 space-y-3 text-paper/70">
              {EQUIPMENT.map((item) => (
                <li key={item} className="border-b border-line pb-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-3xl sm:text-4xl">
              ¿Hablamos de tu proyecto?
            </h2>
            <p className="mt-4 max-w-md text-paper/60">
              Encargos, licencias de uso comercial o impresiones a medida —
              escríbeme y lo hablamos.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-sm uppercase tracking-wide"
            >
              {siteConfig.email} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
