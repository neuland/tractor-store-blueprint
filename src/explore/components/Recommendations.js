import data from "../database/database.json" assert { type: "json" };
import { html } from "../utils.js";

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
    ? html`<div data-boundary="explore-recommendations">
        <h2>Recommendations</h2>
        <ul>
          ${recos
            .map(
              (p) =>
                html`<li>
                  <a href="${p.url}">${p.name}</a><br />
                  <small>${p.sku} / ${p.price} Øcken</small>
                </li>`,
            )
            .join("")}
        </ul>
      </div>`
    : "";
};
