"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCartStore, cartTotalCents } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format-price";
import { useHasMounted } from "@/lib/use-has-mounted";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const mounted = useHasMounted();

  const total = mounted ? cartTotalCents(items) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60"
            onClick={close}
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-line bg-surface"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-xl">Tu carrito</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar carrito"
                className="text-paper/70 hover:text-paper"
              >
                <X size={22} />
              </button>
            </div>

            {!mounted || items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-paper/60">
                <p>Tu carrito está vacío.</p>
                <Link
                  href="/portfolio"
                  onClick={close}
                  className="link-underline text-accent"
                >
                  Explorar el portfolio
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-5">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-black/30">
                        <Image
                          src={item.imageUrl}
                          alt={item.photoTitle}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-sm leading-tight">
                              {item.photoTitle}
                            </p>
                            <p className="text-xs uppercase tracking-wide text-paper/50">
                              {item.label}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label="Eliminar"
                            className="text-paper/40 hover:text-paper"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-line px-2 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.id, item.quantity - 1)
                              }
                              aria-label="Restar"
                              className="text-paper/70 hover:text-paper"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-4 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.id, item.quantity + 1)
                              }
                              aria-label="Sumar"
                              className="text-paper/70 hover:text-paper"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="font-mono text-sm">
                            {formatPrice(
                              item.amountCents * item.quantity,
                              item.currency,
                            )}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line px-6 py-6">
                  <div className="mb-4 flex items-center justify-between text-sm uppercase tracking-wide text-paper/60">
                    <span>Subtotal</span>
                    <span className="font-mono text-base text-paper">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <Link
                    href="/carrito"
                    onClick={close}
                    className="block w-full bg-paper py-3 text-center text-sm font-medium uppercase tracking-wide text-ink transition hover:bg-accent"
                  >
                    Ver carrito y pagar
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
