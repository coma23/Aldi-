import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pago cancelado" };

export default function CheckoutCancelPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
        Pago cancelado
      </p>
      <h1 className="font-display text-4xl sm:text-5xl">
        No se ha completado el pago
      </h1>
      <p className="mt-4 max-w-md text-paper/60">
        Tu carrito sigue intacto. Puedes volver a intentarlo cuando quieras.
      </p>
      <Link
        href="/carrito"
        className="link-underline mt-10 text-sm uppercase tracking-wide"
      >
        Volver al carrito
      </Link>
    </div>
  );
}
