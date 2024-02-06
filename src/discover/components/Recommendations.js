import data from "../data.js";

function recosForSku(sku) {
  return data.recommendations[sku] || [];
}

function recosForSkus(skus) {
  const result = skus.flatMap(recosForSku);
  // Remove duplicates
  return Array.from(new Set(result));
}

export default ({ skus }) => {
  const recos = recosForSkus(skus);
  return recos.length
    ? `<div data-boundary="discover-recommendations">
    <h2>Recommendations</h2>
    <ul>
      ${recos
        .map(
          (p) =>
            `<li><a href="${p.url}">${p.name}</a><br/><small>${p.sku} / ${p.price} Øcken</small></li>`
        )
        .join("")}
    </ul>
  </div>`
    : "";
};
