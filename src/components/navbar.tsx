"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { CartButton } from "@/components/cart-button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/paises", label: "Países" },
  { href: "/sobre-mi", label: "Sobre mí" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu when navigating, adjusted during render (per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  // rather than in an effect.
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled || mobileOpen
          ? "border-b border-line bg-surface/85 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-black/50 to-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className="font-display text-xl tracking-tight sm:text-2xl"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-10 text-sm tracking-wide text-paper/80 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-underline pb-1 uppercase",
                pathname.startsWith(link.href) && "text-paper",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <CartButton />
          <button
            type="button"
            aria-label="Abrir menú"
            className="text-paper md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-surface px-6 pb-8 pt-4 md:hidden">
          <ul className="flex flex-col gap-5 text-lg">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-display">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
