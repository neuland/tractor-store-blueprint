export default ({ sku, id, name, quantity }) => {
  const url = `/product/${id}?sku=${sku}`;
  return `<li class="LineItem">
    <a href="${url}" class="LineItem__image">
      <img src="/images/${sku}.jpg" alt="${name}" />
    </a>
    <a href="${url}" class="LineItem__name">
      <strong>${name}</strong><br>${sku}
    </a>
    <div class="LineItem__quantity">${quantity}</div>
    <form action="/buy/cart/remove" method="post">
      <input type="hidden" name="sku" value="${sku}" />
      <input type="submit" value="remove" />
    </form>
  </li>`;
};
