import Image from "next/image";
import Link from "next/link";

export interface PhotoCardData {
  slug: string;
  title: string;
  location: string;
  imageUrl: string;
  width: number;
  height: number;
  category: { name: string };
}

export function PhotoCard({
  photo,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  fillCell = false,
}: {
  photo: PhotoCardData;
  priority?: boolean;
  sizes?: string;
  /** Fill the parent grid cell (e.g. a masonry row-span) instead of using the photo's own aspect ratio. */
  fillCell?: boolean;
}) {
  return (
    <Link
      href={`/portfolio/${photo.slug}`}
      className={
        fillCell
          ? "group relative block h-full w-full overflow-hidden bg-black/30"
          : "group relative block overflow-hidden bg-black/30"
      }
    >
      <div
        className="relative w-full"
        style={
          fillCell
            ? { height: "100%" }
            : { aspectRatio: `${photo.width} / ${photo.height}` }
        }
      >
        <Image
          src={photo.imageUrl}
          alt={photo.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition duration-500 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-xs uppercase tracking-widest text-accent">
            {photo.category.name}
          </p>
          <p className="font-display text-lg text-paper">{photo.title}</p>
          <p className="text-xs text-paper/60">{photo.location}</p>
        </div>
      </div>
    </Link>
  );
}
