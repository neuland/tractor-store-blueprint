import { html } from "../utils.js";

export default ({
  tag = "button",
  href,
  type,
  value,
  onClick,
  disabled,
  rounded,
  className,
  children,
  variant = "secondary",
}) => {
  return html` <${href ? "a" : tag}
    ${disabled ? "disabled" : ""}
    ${href ? `href="${href}"` : ""}
    ${type ? `type="${type}"` : ""}
    ${value ? `value="${value}"` : ""}
    ${onClick ? `onclick="${onClick}"` : ""}
    class="c_Button c_Button--${variant} ${className} ${rounded ? "c_Button--rounded" : ""}"
    ontouchstart
  >
    <div class="c_Button__inner">${children}</div>
  </${href ? "a" : tag}>`;
};
