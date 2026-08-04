"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  /** `${photoId}:${priceOptionId}` — unique per purchasable option. */
  id: string;
  photoId: string;
  photoSlug: string;
  photoTitle: string;
  imageUrl: string;
  priceOptionId: string;
  type: "DIGITAL" | "PRINT";
  label: string;
  amountCents: number;
  currency: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...items, { ...item, quantity }], isOpen: true });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      setQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "portfolio-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartTotalCents(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.amountCents * i.quantity, 0);
}
