// Locale-neutral currency formatter that accepts a user-chosen symbol.
export function formatMoney(amount, symbol = "R") {
  const n = Number.isFinite(amount) ? amount : 0;
  const negative = n < 0;
  const abs = Math.abs(n);
  const [whole, decimals] = abs.toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}${symbol} ${grouped}.${decimals}`;
}

export function parseAmount(raw) {
  if (typeof raw === "number") return raw;
  if (!raw) return 0;
  const cleaned = String(raw).replace(/[^0-9.-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}
