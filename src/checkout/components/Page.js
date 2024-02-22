import { html } from "../utils.js";

export default ({ content }) => {
  return html`<!doctype html>
    <html>
      <head>
        <title>Tractor Store</title>
        <link rel="stylesheet" href="/explore/styles.css" />
        <link rel="stylesheet" href="/decide/styles.css" />
        <link rel="stylesheet" href="/checkout/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body data-boundary="checkout-page">
        ${content}
        <script src="/explore/scripts.js" type="module"></script>
        <script src="/decide/scripts.js" type="module"></script>
        <script src="/checkout/scripts.js" type="module"></script>
        <script src="/cdn/js/helper.js" type="module"></script>
      </body>
    </html>`;
};
