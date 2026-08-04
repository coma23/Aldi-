import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { siteConfig } from "@/lib/site-config";

interface CheckoutItemInput {
  photoId: string;
  priceOptionId: string;
  quantity: number;
}

interface CheckoutBody {
  email: string;
  items: CheckoutItemInput[];
  shipping?: {
    name: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
}

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (!body.email || !body.items?.length) {
    return NextResponse.json(
      { error: "Faltan el email o los artículos del carrito." },
      { status: 400 },
    );
  }

  // Re-fetch prices from the database — never trust amounts sent by the client.
  const priceOptionIds = body.items.map((i) => i.priceOptionId);
  const priceOptions = await prisma.priceOption.findMany({
    where: { id: { in: priceOptionIds } },
    include: { photo: true },
  });
  const priceById = new Map(priceOptions.map((p) => [p.id, p]));

  const hasPrint = body.items.some((i) => {
    const price = priceById.get(i.priceOptionId);
    return price?.type === "PRINT";
  });
  if (
    hasPrint &&
    (!body.shipping?.name ||
      !body.shipping?.address ||
      !body.shipping?.city ||
      !body.shipping?.zip ||
      !body.shipping?.country)
  ) {
    return NextResponse.json(
      { error: "Falta la dirección de envío para las impresiones físicas." },
      { status: 400 },
    );
  }

  const lineItems: {
    photoId: string;
    priceOptionId: string;
    title: string;
    label: string;
    type: string;
    quantity: number;
    amountCents: number;
    currency: string;
  }[] = [];

  for (const item of body.items) {
    const price = priceById.get(item.priceOptionId);
    if (!price || price.photoId !== item.photoId || item.quantity < 1) {
      return NextResponse.json(
        { error: "Uno de los artículos del carrito ya no está disponible." },
        { status: 400 },
      );
    }
    lineItems.push({
      photoId: price.photoId,
      priceOptionId: price.id,
      title: price.photo.title,
      label: price.label,
      type: price.type,
      quantity: item.quantity,
      amountCents: price.amountCents,
      currency: price.currency,
    });
  }

  const currency = lineItems[0]?.currency ?? "eur";
  const totalCents = lineItems.reduce(
    (sum, i) => sum + i.amountCents * i.quantity,
    0,
  );

  let stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Stripe no configurado." },
      { status: 500 },
    );
  }

  const order = await prisma.order.create({
    data: {
      stripeSessionId: `pending_${crypto.randomUUID()}`,
      email: body.email,
      status: "PENDING",
      totalCents,
      currency,
      shippingName: body.shipping?.name,
      shippingAddress: body.shipping?.address,
      shippingCity: body.shipping?.city,
      shippingZip: body.shipping?.zip,
      shippingCountry: body.shipping?.country,
      items: {
        create: lineItems.map((i) => ({
          photoId: i.photoId,
          priceOptionId: i.priceOptionId,
          title: i.title,
          label: i.label,
          type: i.type,
          quantity: i.quantity,
          amountCents: i.amountCents,
        })),
      },
    },
  });

  const origin =
    request.headers.get("origin") ?? new URL(request.url).origin ?? siteConfig.url;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.email,
      line_items: lineItems.map((i) => ({
        quantity: i.quantity,
        price_data: {
          currency: i.currency,
          unit_amount: i.amountCents,
          product_data: {
            name: `${i.title} — ${i.label}`,
          },
        },
      })),
      metadata: { orderId: order.id },
      success_url: `${origin}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancelado`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCELED" },
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo crear la sesión de pago.",
      },
      { status: 500 },
    );
  }
}
