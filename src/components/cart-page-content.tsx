"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, cartTotalCents } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format-price";
import { useHasMounted } from "@/lib/use-has-mounted";

export function CartPageContent() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const mounted = useHasMounted();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPrint = items.some((i) => i.type === "PRINT");
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center text-paper/60">
        <p>Todavía no has añadido ninguna fotografía.</p>
        <Link href="/portfolio" className="link-underline text-accent">
          Explorar el portfolio
        </Link>
      </div>
    );
  }

  const total = cartTotalCents(items);

  async function handleCheckout() {
    setError(null);
    if (!email) {
      setError("Introduce tu email para continuar.");
      return;
    }
    if (hasPrint && (!shipping.name || !shipping.address || !shipping.city || !shipping.zip || !shipping.country)) {
      setError("Completa la dirección de envío para las impresiones físicas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            photoId: i.photoId,
            priceOptionId: i.priceOptionId,
            quantity: i.quantity,
          })),
          email,
          shipping: hasPrint ? shipping : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "No se pudo iniciar el pago.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.id} className="flex gap-5 py-6">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-black/30">
              <Image
                src={item.imageUrl}
                alt={item.photoTitle}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/portfolio/${item.photoSlug}`}
                    className="font-display text-xl link-underline"
                  >
                    {item.photoTitle}
                  </Link>
                  <p className="mt-1 text-xs uppercase tracking-wide text-paper/50">
                    {item.label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-paper/40 hover:text-paper"
                  aria-label="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 border border-line px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    className="text-paper/70 hover:text-paper"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    className="text-paper/70 hover:text-paper"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-mono">
                  {formatPrice(item.amountCents * item.quantity, item.currency)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="h-fit border border-line p-6">
        <div className="mb-6 flex items-center justify-between text-lg">
          <span>Subtotal</span>
          <span className="font-mono">{formatPrice(total)}</span>
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-paper/40">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-paper"
          />
        </label>

        {hasPrint && (
          <div className="mb-4 space-y-3 border-t border-line pt-4">
            <p className="text-xs uppercase tracking-widest text-paper/40">
              Dirección de envío
            </p>
            <input
              placeholder="Nombre completo"
              value={shipping.name}
              onChange={(e) =>
                setShipping((s) => ({ ...s, name: e.target.value }))
              }
              className="w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-paper"
            />
            <input
              placeholder="Dirección"
              value={shipping.address}
              onChange={(e) =>
                setShipping((s) => ({ ...s, address: e.target.value }))
              }
              className="w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-paper"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Ciudad"
                value={shipping.city}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, city: e.target.value }))
                }
                className="w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-paper"
              />
              <input
                placeholder="Código postal"
                value={shipping.zip}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, zip: e.target.value }))
                }
                className="w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-paper"
              />
            </div>
            <input
              placeholder="País"
              value={shipping.country}
              onChange={(e) =>
                setShipping((s) => ({ ...s, country: e.target.value }))
              }
              className="w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-paper"
            />
          </div>
        )}

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-paper py-4 text-sm font-medium uppercase tracking-wide text-ink transition hover:bg-accent disabled:opacity-50"
        >
          {loading ? "Redirigiendo al pago..." : "Ir al pago"}
        </button>
        <p className="mt-3 text-center text-xs text-paper/40">
          Pago seguro procesado por Stripe.
        </p>
      </div>
    </div>
  );
}
