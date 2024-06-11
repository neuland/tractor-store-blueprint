import { html, IMAGE_SERVER } from "../utils.js";

export default () => {
  return html`<footer class="e_Footer" data-boundary="explore">
    <div class="e_Footer__cutter">
      <div class="e_Footer__inner">
        <div class="e_Footer__initiative">
          <!-- please leave this part untouched -->
          <img
            src="${IMAGE_SERVER}/cdn/img/neulandlogo.svg"
            alt="neuland - Büro für Informatik"
            width="45"
            height="40"
          />
          <p>
            based on
            <a
              href="https://micro-frontends.org/tractor-store/"
              target="_blank"
            >
              the tractor store 2.0
            </a>
            <br />
            a
            <a href="https://neuland-bfi.de" target="_blank">neuland</a> project
          </p>
        </div>

        <div class="e_Footer__credits">
          <!-- replace this details about your implementation and organization -->
          <h3>techstack</h3>
          <p>
            ssr-only, modular monolith, template strings, esbuild, hono,
            cloudflare workers
          </p>
          <p>
            build by
            <img
              src="${IMAGE_SERVER}/cdn/img/neulandlogo.svg"
              alt="neuland - Büro für Informatik"
              width="15"
              height="13"
            />
            <a href="https://neuland-bfi.de" target="_blank">neuland</a>
            /
            <a
              href="https://github.com/neuland/tractor-store-blueprint"
              target="_blank"
            >
              github
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>`;
};
