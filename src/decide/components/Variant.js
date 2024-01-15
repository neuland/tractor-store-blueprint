export default ({ sku, name, selected }) => {
  return `<li>${
    selected ? `<strong>${name}</strong>` : `<a href="?sku=${sku}">${name}</a>`
  }</li>`;
};
