import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format-price";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

export const metadata: Metadata = { title: "Pago completado" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const order = session_id
    ? await prisma.order.findUnique({
        where: { stripeSessionId: session_id },
        include: { items: true },
      })
    : null;

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <ClearCartOnMount />
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
        Gracias
      </p>
      <h1 className="font-display text-4xl sm:text-5xl">
        Tu pedido ha sido recibido
      </h1>
      <p className="mt-4 max-w-md text-paper/60">
        Te enviaremos un email de confirmación en breve. Las descargas
        digitales estarán disponibles en tu correo y los pedidos con
        impresión física se preparan y envían en 3–5 días laborables.
      </p>

      {order && (
        <div className="mt-10 w-full max-w-md border border-line p-6 text-left">
          <p className="mb-4 flex items-center justify-between text-sm uppercase tracking-wide text-paper/50">
            <span>Pedido</span>
            <span className="font-mono text-paper">{order.id.slice(-8)}</span>
          </p>
          <ul className="space-y-2 border-t border-line pt-4 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.title} × {item.quantity}
                  <span className="block text-xs text-paper/40">
                    {item.label}
                  </span>
                </span>
                <span className="font-mono">
                  {formatPrice(item.amountCents * item.quantity, order.currency)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-mono">
            <span>Total</span>
            <span>{formatPrice(order.totalCents, order.currency)}</span>
          </div>
        </div>
      )}

      <Link
        href="/portfolio"
        className="link-underline mt-10 text-sm uppercase tracking-wide"
      >
        Seguir explorando
      </Link>
    </div>
  );
}
