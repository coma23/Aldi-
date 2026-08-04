import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

/** Lazily instantiate so the app can boot without Stripe keys configured. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY no está configurada. Añádela a tu archivo .env (ver .env.example).",
    );
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}
