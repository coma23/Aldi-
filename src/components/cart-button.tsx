"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore, cartCount } from "@/lib/cart-store";
import { useHasMounted } from "@/lib/use-has-mounted";

export function CartButton() {
  const items = useCartStore((s) => s.items);
  const toggle = useCartStore((s) => s.toggle);
  const mounted = useHasMounted();
  const count = mounted ? cartCount(items) : 0;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Abrir carrito"
      className="relative flex items-center gap-1 text-paper"
    >
      <ShoppingBag size={22} strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-ink">
          {count}
        </span>
      )}
    </button>
  );
}
