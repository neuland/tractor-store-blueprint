import { html } from "../utils.js";

/**
 * Recommendation component.
 * @param {RecoItem} props - The properties of the Recommendation component.
 * @returns {string} The Recommendation component markup.
 */
export default ({ image, url, name }) => {
  return html`<li class="e_Recommendation">
    <a class="e_Recommendation_link" href="${url}">
      <img class="e_Recommendation_image" src="${image}" width="200" />
      <span class="e_Recommendation_name">${name}</span>
    </a>
  </li>`;
};
