# The Tractor Store - Blueprint

## What is The Tractor Store?

The Tractor Store is a template to experiment with micro frontend architecture.
Goal is to create a real world application where developers can experiment with different integration techniques.

The idea is similar to [TodoMVC](http://todomvc.com/) or [Movies](https://tastejs.com/movies/), but with a focus on micro frontends.

## About this implementation

### Boundaries 📄

- 🔴 Discover
  - 📄 Home & Catalog
  - 📄 Search
  - 🧩 Header (🔴🔵🟢 every page, except checkout)
  - 🧩 Footer (🔴🔵🟢 every page)
  - 🧩 Recommendations (🔵 product details)
- 🔵 Decide
  - 📄 Product Details
- 🟢 Buy
  - 📄 Cart
  - 📄 Checkout
  - 📄 Confirmation
  - 🧩 Mini Cart (🔴 header)
  - 🧩 Buy Button (🔵 product details)
