import { html } from "../utils.js";

export default ({
  href,
  type,
  value,
  disabled,
  rounded,
  className,
  children,
  variant = "secondary",
}) => {
  const tag = href ? "a" : "button";
  return html` <${tag}
    ${disabled ? "disabled" : ""}
    ${href ? `href="${href}"` : ""}
    ${type ? `type="${type}"` : ""}
    ${value ? `value="${value}"` : ""}
    class="c_Button c_Button--${variant} ${className} ${rounded ? "c_Button--rounded" : ""}"
    ontouchstart
  >
    <div class="c_Button__inner">${children}</div>
  </${tag}>`;
};
