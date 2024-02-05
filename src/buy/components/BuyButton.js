export default ({ sku }) => {
  return `<form action="/buy/cart/add" method="POST" class="BuyButton" data-boundary="buy-button">
  <input type="hidden" name="sku" value="${sku}" />
  <button>buy ${sku}</button>
</form>`;
};
