import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart-page-content";

export const metadata: Metadata = {
  title: "Carrito",
};

export default function CartPage() {
  return (
    <div className="container-page min-h-[70vh] pb-24 pt-32 sm:pt-40">
      <h1 className="mb-12 font-display text-5xl sm:text-6xl">Tu carrito</h1>
      <CartPageContent />
    </div>
  );
}
