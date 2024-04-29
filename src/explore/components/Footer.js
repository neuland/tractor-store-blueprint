import { html } from "../utils.js";

export default () => {
  return html`<footer class="e_Footer" data-boundary="explore-footer">
    <div class="e_Footer__cutter">
      <div class="e_Footer__inner">
        <div class="e_Footer__initiative">
          <img
            src="/cdn/img/neulandlogo.svg"
            alt="neuland - Büro für Informatik"
          />
          <p>
            the tractor store reference implementation <br />
            a <a href="https://neuland-bfi.de">neuland</a> project
          </p>
        </div>

        <div class="e_Footer__credits">
          <h4>techstack</h4>
          <p>
            build with no frameworks, server-side, modular monolith, Node.js
          </p>
          <p>
            build by
            <img
              src="/cdn/img/neulandlogo.svg"
              alt="neuland - Büro für Informatik"
            />
            <a href="https://neuland-bfi.de"> neuland</a>
          </p>
        </div>
      </div>
    </div>
  </footer>`;
};
