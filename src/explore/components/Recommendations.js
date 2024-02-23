import data from "../database/index.js";
import { html } from "../utils.js";
import Recommendation from "./Recommendation.js";

const BESTSELLER = ["AU-04-RD", "AU-03-YE", "AU-05-ZH"];

function recosForSku(sku) {
  const recoSkus = data.recommendations.relations[sku] || BESTSELLER;
  return recoSkus.map((sku) => data.recommendations.variants[sku]);
}

function recosForSkus(skus, max = 4) {
  const listOfRecos = skus.map(recosForSku);

  // take first of each list until we have enough
  const result = [];
  let i = 0;
  while (listOfRecos.some((recos) => recos[i])) {
    listOfRecos.forEach((recos) => {
      if (recos[i] && !result.includes(recos[i])) {
        result.push(recos[i]);
      }
    });
    i++;
  }
  return result.slice(0, max);
}

export default ({ skus }) => {
  const recos = recosForSkus(skus);
  return recos.length
    ? html`<div
        class="e_Recommendations"
        data-boundary="explore-recommendations"
      >
        <h2>Recommendations</h2>
        <ul class="e_Recommendations_list">
          ${recos.map(Recommendation).join("")}
        </ul>
      </div>`
    : "";
};
