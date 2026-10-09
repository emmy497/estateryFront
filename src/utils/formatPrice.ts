

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
};

// Compact form for map pins: ₦850K, ₦1.5M, ₦75M, ₦1.2B
export const formatPriceShort = (price: number): string =>
  "₦" +
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(price);
