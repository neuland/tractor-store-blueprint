import { html } from "../utils.js";
import Meta from "./Meta.js";

export default ({ content }) => {
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Tractor Store</title>
        <meta
          name="description"
          content="a non-trivial micro frontends example project"
        />
        <link rel="stylesheet" href="/explore/static/styles.css" />
        <link rel="stylesheet" href="/decide/static/styles.css" />
        <link rel="stylesheet" href="/checkout/static/styles.css" />
        ${Meta()}
      </head>
      <body data-boundary-page="checkout">
        ${content}
        <script src="/explore/static/scripts.js" type="module"></script>
        <script src="/decide/static/scripts.js" type="module"></script>
        <script src="/checkout/static/scripts.js" type="module"></script>
        <script src="/cdn/js/helper.js" type="module"></script>
      </body>
    </html>`;
};
