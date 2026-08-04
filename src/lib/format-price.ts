export function formatPrice(amountCents: number, currency = "eur") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}
