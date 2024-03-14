import Page from "../components/Page.js";
import Header from "../../explore/components/Header.js";
import { html } from "../utils.js";
import Footer from "../../explore/components/Footer.js";
import Button from "../components/Button.js";

export default ({ c }) => {
  const content = html`
    ${Header({ c })}
    <main class="c_Thanks">
      <h2>Thanks for your order!</h2>
      <p>We'll notify you, when its ready for pickup.</p>

      ${Button({
        href: "/",
        children: "Continue Shopping",
        variant: "secondary",
      })}
    </main>
    ${Footer()}
  `;
  return Page({ content });
};
