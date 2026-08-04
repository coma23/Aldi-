"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/cn";

interface PriceOption {
  id: string;
  type: string;
  label: string;
  description: string;
  amountCents: number;
  currency: string;
}

export function AddToCartForm({
  photo,
  prices,
}: {
  photo: { id: string; slug: string; title: string; imageUrl: string };
  prices: PriceOption[];
}) {
  const [selectedId, setSelectedId] = useState(prices[0]?.id);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selected = prices.find((p) => p.id === selectedId) ?? prices[0];
  const digitalOptions = prices.filter((p) => p.type === "DIGITAL");
  const printOptions = prices.filter((p) => p.type === "PRINT");

  function handleAdd() {
    if (!selected) return;
    addItem({
      id: `${photo.id}:${selected.id}`,
      photoId: photo.id,
      photoSlug: photo.slug,
      photoTitle: photo.title,
      imageUrl: photo.imageUrl,
      priceOptionId: selected.id,
      type: selected.type as "DIGITAL" | "PRINT",
      label: selected.label,
      amountCents: selected.amountCents,
      currency: selected.currency,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div>
      {digitalOptions.length > 0 && (
        <fieldset className="mb-4">
          <legend className="mb-2 text-xs uppercase tracking-widest text-paper/40">
            Digital
          </legend>
          <div className="flex flex-col gap-2">
            {digitalOptions.map((price) => (
              <PriceRow
                key={price.id}
                price={price}
                selected={price.id === selectedId}
                onSelect={() => setSelectedId(price.id)}
              />
            ))}
          </div>
        </fieldset>
      )}

      {printOptions.length > 0 && (
        <fieldset className="mb-6">
          <legend className="mb-2 text-xs uppercase tracking-widest text-paper/40">
            Impresión física
          </legend>
          <div className="flex flex-col gap-2">
            {printOptions.map((price) => (
              <PriceRow
                key={price.id}
                price={price}
                selected={price.id === selectedId}
                onSelect={() => setSelectedId(price.id)}
              />
            ))}
          </div>
        </fieldset>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={!selected}
        className={cn(
          "flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-medium uppercase tracking-wide transition",
          justAdded
            ? "bg-accent text-ink"
            : "bg-paper text-ink hover:bg-accent",
        )}
      >
        {justAdded ? (
          <>
            <Check size={16} /> Añadido al carrito
          </>
        ) : (
          <>
            <ShoppingBag size={16} />
            Añadir al carrito · {selected ? formatPrice(selected.amountCents, selected.currency) : ""}
          </>
        )}
      </button>
    </div>
  );
}

function PriceRow({
  price,
  selected,
  onSelect,
}: {
  price: PriceOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center justify-between border px-4 py-3 text-left transition",
        selected
          ? "border-paper bg-white/[0.04]"
          : "border-line hover:border-paper/40",
      )}
    >
      <span>
        <span className="block text-sm">{price.label}</span>
        <span className="block text-xs text-paper/50">
          {price.description}
        </span>
      </span>
      <span className="font-mono text-sm">
        {formatPrice(price.amountCents, price.currency)}
      </span>
    </button>
  );
}
