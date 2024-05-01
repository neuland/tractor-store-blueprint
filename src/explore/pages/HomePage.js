import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Recommendations from "../components/Recommendations.js";
import { html } from "../utils.js";

/**
 * HomePage component.
 * @param {object} props - The properties of the HomePage component.
 * @param {HonoContext} props.c - The hone context.
 * @returns {string} The HomePage component markup.
 */
export default ({ c }) => {
  return html`<!doctype html>
    <html>
      <head>
        <title>Tractor Store</title>
        <link rel="stylesheet" href="/explore/static/styles.css" />
        <link rel="stylesheet" href="/decide/static/styles.css" />
        <link rel="stylesheet" href="/checkout/static/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body data-boundary="explore-page">
        ${Header({ c })}
        <main class="e_HomePage">
          <a class="e_HomePage__categoryLink" href="/products/classic"
            ><img src="/cdn/img/scene/classics.jpg" alt="Classic Tractor"
          /></a>
          <a class="e_HomePage__categoryLink" href="/products/autonomous"
            ><img src="/cdn/img/scene/autonomous.jpg" alt="Autonomous Tractor"
          /></a>
          <div class="e_HomePage__recommendations">
            ${Recommendations({ skus: ["sku-1", "sku-2", "sku-3", "sku-4"] })}
          </div>
        </main>
        ${Footer()}
        <script src="/explore/static/scripts.js" type="module"></script>
        <script src="/decide/static/scripts.js" type="module"></script>
        <script src="/checkout/static/scripts.js" type="module"></script>
        <script src="/cdn/js/helper.js" type="module"></script>
      </body>
    </html>`;
};
