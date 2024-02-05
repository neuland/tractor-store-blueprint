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
  return `<div data-boundary="discover-recommendations">
    <h2>Recommendations</h2>
    <ul>
      ${recosForSkus(skus)
        .map((sku) => `<li>${sku}</li>`)
        .join("")}
    </ul>
  </div>`;
};
