export default ({ name, sku }) => {
  return `<li><a href="/product/${sku}">${name}</a></li>`;
};
