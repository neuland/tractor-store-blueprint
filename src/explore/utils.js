export function productUrl(id, sku) {
  const query = sku ? `?sku=${sku}` : "";
  return `/product/${id}${query}`;
}

// for prettier formatting
// see https://prettier.io/docs/en/options.html#embedded-language-formatting
export const html = String.raw;
