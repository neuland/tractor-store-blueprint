export default ({ sku }) => {
  return `<form action="/buy/addtocart" method="POST" class="BuyButton" data-boundary="buy-button">
  <input type="hidden" name="sku" value="${sku}" />
  <button>buy ${sku}</button>
</form>`;
};
