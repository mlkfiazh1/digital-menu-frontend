const PRODUCT_API_URL = import.meta.env.VITE_PRODUCT_API_URL;

export function mediaUrl(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${PRODUCT_API_URL}/media/${image}`;
}

export function formatPrice(price) {
  const value = Number(price);
  if (Number.isNaN(value)) return "";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function menuUrl(slug) {
  return `${window.location.origin}/menu/${slug}`;
}
