import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPhotoBySlug, getRelatedPhotos } from "@/lib/data";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { PhotoCard } from "@/components/photo-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);
  if (!photo) return {};
  return {
    title: photo.title,
    description: photo.description,
  };
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);
  if (!photo) notFound();

  const related = await getRelatedPhotos(photo.id, photo.categoryId, 3);

  const dateLabel = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(photo.capturedAt);

  return (
    <div className="pt-24 sm:pt-28">
      <div className="grid lg:grid-cols-[1fr_420px]">
        <div className="relative bg-black/30">
          <div
            className="relative w-full lg:h-[calc(100vh-7rem)]"
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="border-t border-line px-6 py-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-14">
          <div className="flex gap-3 text-xs uppercase tracking-widest text-paper/50">
            <Link
              href={`/portfolio?categoria=${photo.category.slug}`}
              className="link-underline text-accent"
            >
              {photo.category.name}
            </Link>
            <span>·</span>
            <Link
              href={`/portfolio?pais=${photo.country.slug}`}
              className="link-underline"
            >
              {photo.country.name}
            </Link>
          </div>

          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            {photo.title}
          </h1>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-6 font-mono text-xs text-paper/60">
            <div>
              <dt className="text-paper/40">Ubicación</dt>
              <dd className="mt-1 text-paper">{photo.location}</dd>
            </div>
            <div>
              <dt className="text-paper/40">Fecha</dt>
              <dd className="mt-1 text-paper capitalize">{dateLabel}</dd>
            </div>
          </dl>

          <p className="mt-6 leading-relaxed text-paper/70">
            {photo.description}
          </p>

          <div className="mt-8">
            <AddToCartForm
              photo={{
                id: photo.id,
                slug: photo.slug,
                title: photo.title,
                imageUrl: photo.imageUrl,
              }}
              prices={photo.prices}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page py-24">
          <h2 className="mb-8 font-display text-3xl">
            Más de {photo.category.name.toLowerCase()}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <PhotoCard key={r.id} photo={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
