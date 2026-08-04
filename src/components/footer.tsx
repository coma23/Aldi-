import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl">{siteConfig.name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-paper/40">
            Explorar
          </p>
          <ul className="mt-4 space-y-2 text-sm text-paper/70">
            <li>
              <Link href="/portfolio" className="link-underline">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/paises" className="link-underline">
                Países visitados
              </Link>
            </li>
            <li>
              <Link href="/sobre-mi" className="link-underline">
                Sobre mí
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="link-underline">
                Carrito
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-paper/40">
            Contacto
          </p>
          <ul className="mt-4 space-y-2 text-sm text-paper/70">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="link-underline">
                {siteConfig.email}
              </a>
            </li>
            <li className="text-paper/50">{siteConfig.location}</li>
            <li>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={siteConfig.social.behance}
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                Behance
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-6">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-paper/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.fullName}. Todos los
            derechos reservados.
          </p>
          <p>Todas las imágenes son obra original y están protegidas.</p>
        </div>
      </div>
    </footer>
  );
}
