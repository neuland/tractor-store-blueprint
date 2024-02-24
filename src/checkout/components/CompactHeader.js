import { html } from "../utils.js";

export default () => {
  return html`<header class="c_CompactHeader">
    <div class="c_CompactHeader__inner">
      <a class="c_CompactHeader__link" href="/">
        <img
          class="c_CompactHeader__logo"
          src="/cdn/img/logo.svg"
          alt="Micro Frontends - Tractor Store"
        />
      </a>
    </div>
  </header>`;
};
