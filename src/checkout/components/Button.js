import { html } from "../utils.js";

/**
 * Button component.
 * @param {object} props - The properties of the button.
 * @param {string} [props.href] - The href for the button if it's a link.
 * @param {string} [props.type] - The type of the button.
 * @param {string} [props.value] - The value of the button.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {boolean} [props.rounded] - Whether the button is rounded.
 * @param {string} [props.className] - Additional CSS classes for the button.
 * @param {string} [props.children] - The content inside the button.
 * @param {string} [props.dataId] - The data-id attribute of the button.
 * @param {('primary'|'secondary')} [props.variant] - The variant of the button. Valid options are 'primary' and 'secondary'.
 * @returns {string} The button markup.
 */
export default ({
  href,
  type,
  value,
  disabled,
  rounded,
  className = "",
  children,
  dataId,
  variant = "secondary",
}) => {
  const tag = href ? "a" : "button";
  return html` <${tag}
    ${disabled ? "disabled" : ""}
    ${href ? `href="${href}"` : ""}
    ${type ? `type="${type}"` : ""}
    ${value ? `value="${value}"` : ""}
    ${dataId ? `data-id="${dataId}"` : ""}
    class="c_Button c_Button--${variant} ${className} ${rounded ? "c_Button--rounded" : ""}"
    ontouchstart
  >
    <div class="c_Button__inner">${children}</div>
  </${tag}>`;
};
