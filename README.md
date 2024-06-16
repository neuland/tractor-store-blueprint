# The Tractor Store - Blueprint

## What is The Tractor Store?

The Tractor Store is a template to experiment with micro frontend architecture.
Goal is to create a real world application where developers can experiment with different integration techniques.

The idea is similar to [TodoMVC](http://todomvc.com/) or [Movies](https://tastejs.com/movies/), but with a focus on micro frontends. Visit [micro-frontends.org/tractor](https://micro-frontends.org/tractor-store/) to learn more.

**Live Demo:** [blueprint.the-tractor.store](https://blueprint.the-tractor.store)

## About This Project

- Three systems: Explore, Decide, Checkout are established along the customer journey (buying process)
- Team missions
  - Explore: Helps the customer to explore and navigate through the broad tractor catalog.
  - Decide: Helps the customer to make an informed buying decision by presenting all necessary details.
  - Checkout: Provides an easy and straight forward checkout process.
- Store that sells tractors
- E-commerce platform (homepage, catalog, product details, cart, checkout, thank you page)
- Special features: Add to cart animation, recommendations, store picker, thank you confetti
- Focus on frontend aspects. Backend and database are mocked with static data.
- Styling is provided in the blueprint. It's not the focus of this project.
- Static assets (images, fonts, helpers, ...) are provided. They can be copied or linked to directly ([CDN](https://blueprint.the-tractor.store)).

## Design Principals

- Each system can be developed and deployed independently by different teams
- The freedom to change a systems technology stack without affecting the others must be guaranteed
- Self-contained systems: Each system has its own database, backend and frontend
- Loose coupling: Systems should be able to function independently of each other as best as possible
- Provide a way to run the entire application locally for development and testing

## Implementation Choices

- All described features must be implemented.
- The concrete implementation is up to you (frontend framework, style handling, etc.)
- Communication between systems can be achieved with different techniques (client, server, shared state, events, event-bus, etc.)
- Server- and/or client-rendering is possible
- An application shell is not required, but can be implemented if desired
- Deployment can be done with different techniques (container, serverless, static, etc.)
- Bonus objective #1: Extract shared UI components (e.g. the Button) into a shared pattern library.
- Bonus objective #2: The Explore team is getting too big. A new "Inspire" team should be created to take care of product recommendations. Migrate this function to a standalone fourth system.

## Goal of This Project

There is no one-size-fits-all solution for micro frontends.
The goal of this project is to provide a central place, where different micro frontend integration techniques can be compared and evaluated.

- Make pros and cons of different tech-stacks and integration techniques visible and discussable
  - Organizational scalability (more teams, more systems)
  - Technical scalability (more users, more features)
  - Performance characteristics (Core-Web-Vitals, ...)
  - Development experience
- Share knowledge and learnings with the community
- Provide a blueprint for others to experiment with a specific micro frontends tech stack

## Features

### Boundaries 📄

- 🔴 Explore
  - 📄 Home
  - 📄 Category
  - 📄 Stores
  - 🧩 Header (🔴🟢🟡 every page, except checkout)
  - 🧩 Footer (🔴🟢🟡 every page)
  - 🧩 Recommendations (🔴 home, 🟢 product detail, 🟡 cart)
  - 🧩 Store Picker (🟡 checkout)
- 🟢 Decide
  - 📄 Product detail
- 🟡 Checkout
  - 📄 Cart
  - 📄 Checkout
  - 📄 Thank you
  - 🧩 Mini Cart (🔴 header)
  - 🧩 Add To Cart Button (🟢 product details)

### Concepts 🧠

- Inter-team navigation (server- and/or client-side)
- Communication parent-child (variant change > recommendations, add to cart)
- Communication sibling (add to cart > mini cart)
- Communication child-parent (in store pickup > explore )
- Potential client-side interactions (variant change, remove from cart, form validation)
- Nested integration (page > header > mini cart)
- [Bonus] Shared UI components / pattern library (button)
- [Bonus] Migrate recommendations to a new system (Team Inspire)

### Data Structures 💽

Each team has its own data model optimized for their tasks.

- 🔴 Team Explore
  - Categories
    - Products (no variants)
  - Stores
  - Recommendations
    - Recommendable variants
    - Color-based algorithm
- 🟢 Team Decide
  - Products
    - Variants (sku, name, highlights)
- 🟡 Team Checkout
  - Line items
    - Variant (sku, name, price)
    - Inventory
    - Cart state (cookie, sku, quantity)

Use the individual `database.json` files as a data source for each system.
You can render the data directly or build a REST, GraphQL, or other API on top of it.
Check out the [preact implementation](https://github.com/neuland/tractor-store-preact) for an already implemented REST API.

**Note:** This repository also contains a global `products.js` and individual `import.js` files.
They contain raw product data and conversion logic to generate the individual `database.json` files.
Similar to a data-replication mechanism in a real-world project. You can ignore these files.

## About the Blueprint Implementation

The blueprint is deliberately kept simple and unopinionated to make it easy to build specific implementations based on it.

The blueprint does is a **modular monolith** and not a micro frontend architecture.
It has to be deployed as a single unit.
However, the code and data structured are structured in a way that it can be easily split per-team applications.

| Aspect                     | Solution                        |
| -------------------------- | ------------------------------- |
| 🛠️ Frameworks, Libraries   | Pure JS, no dependencies        |
| 📝 Rendering               | SSR-only                        |
| 🐚 Application Shell       | None                            |
| 🧩 Client-Side Integration | None                            |
| 🧩 Server-Side Integration | None (template includes)        |
| 📣 Communication           | Custom Events                   |
| 🗺️ Navigation              | MPA                             |
| 🎨 Styling                 | Plain CSS                       |
| 🍱 Design System           | None                            |
| 🔮 Discovery               | None                            |
| 🚚 Deployment              | Serverless (Cloudflare Workers) |
| 👩‍💻 Local Development       | Node.js, [hono]                 |

[hono]: https://hono.dev

## How To Run Locally

Clone this repository and run the following commands:

```bash
git clone https://github.com/neuland/tractor-store-blueprint.git tractor-store-blueprint
cd tractor-store-blueprint
```

Install and start dev mode:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser to see the running application.
Dev-Mode watches for changes in your server-side code.
It does not watch for changes in your client-side JS and CSS code. This is built once on start.

## Contribute and Build Your Own

Visit the [Tractor Store Website](https://micro-frontends.org/tractor-store/#contribute) for more details.
