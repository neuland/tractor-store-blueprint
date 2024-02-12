# The Tractor Store - Blueprint

## What is The Tractor Store?

The Tractor Store is a template to experiment with micro frontend architecture.
Goal is to create a real world application where developers can experiment with different integration techniques.

The idea is similar to [TodoMVC](http://todomvc.com/) or [Movies](https://tastejs.com/movies/), but with a focus on micro frontends.

## About this implementation

### Boundaries 📄

- 🔴 Explore
  - 📄 Home / Category
  - 📄 Stores
  - 🧩 Header (🔴🔵🟢 every page, except checkout)
  - 🧩 Footer (🔴🔵🟢 every page)
  - 🧩 Recommendations (🔵 product details, 🔴 cart)
  - 🧩 Store Picker (🟢 checkout)
- 🔵 Decide
  - 📄 Product Details
- 🟢 Buy
  - 📄 Cart
  - 📄 Checkout
  - 📄 Thank you
  - 🧩 Mini Cart (🔴 header)
  - 🧩 Buy Button (🔵 product details)

### Concepts 🧠

- Inter-team navigation (server- and/or client-side)
- Communication parent-child (variant change > recommendations, add to cart)
- Communication sibling (add to cart > mini cart)
- Communication child-parent (in store pickup > explore )
- Potential client-side interactions (variant change, remove from cart, form validation)
- Nested integration (page > header > mini cart)
- [Bonus] Shared UI components / pattern library (button)
- [Bonus] Login / authentication

### Infrastructure 🏗️

- Deployment
- Integration service
- Ende-zu-Ende-Tests
