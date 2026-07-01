# FakeStore E-Commerce App

## Overview

This project is a responsive e-commerce app built with React, Vite, React Router, React Query, Redux Toolkit, React Bootstrap, and the FakeStore API.  

Users can browse FakeStore products, reveal the catalog from the Home page, filter products by category, view product details, add items to a cart, update quantities, remove items, and simulate checkout.

## Features

### Home

* Hero section with handcrafted aesthetic
* `Shop Now` button reveals the product catalog within the Home component
* Product catalog can also be opened directly from the Products nav link

### Product Catalog

* Fetches product data from FakeStore API with React Query
* Displays product cards in a responsive React Bootstrap grid
* Shows product image, title, price, category, description, and rating
* Includes an Add to Cart button for each product
* Uses fallback image handling when an API image fails to load

### Category Filtering

* Fetches categories dynamically from `GET /products/categories`
* Renders category options in a select dropdown
* Fetches category-specific products from `GET /products/category/{category}`
* Includes an All products option

### Product Details

* Displays individual product information
* Allows users to add the product to the cart
* Includes fallback image handling
* Supports admin-only edit access

### Shopping Cart

* Uses Redux Toolkit for cart state management
* Stores cart items in `sessionStorage`
* Stores cart as an array of product objects with quantity values
* Displays cart item title, image, quantity, and price
* Supports increasing quantity, decreasing quantity, and removing items
* Displays total product count and total cart price
* Simulates checkout by clearing Redux state and `sessionStorage`
* Shows success feedback after checkout

### Mock Admin Tools

* Admin login: username `admin`, password `password`
* Admin users can add, edit, and delete products
* FakeStore API returns mock success responses, but changes do not persist

## Tech Stack

* React
* Vite
* React Router
* React Query
* Redux Toolkit
* React Redux
* Axios
* React Bootstrap
* Bootstrap
* CSS

## API Endpoints

This app uses the FakeStore API:

* All products: `https://fakestoreapi.com/products`
* Single product: `https://fakestoreapi.com/products/{id}`
* Categories: `https://fakestoreapi.com/products/categories`
* Products by category: `https://fakestoreapi.com/products/category/{category}`

FakeStore API is a mock API. POST, PUT, and DELETE requests return success responses, but the data is not permanently saved.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Project Structure

```text
src/
  components/
  context/
  pages/
  services/
  store/
  styles.css
```

## Notes

The cart uses `sessionStorage`, so cart data persists during the current browser session and clears when checkout is completed.

This app was built off of a more basic version, retaining the original's styling, navigation, and general UX approach while implementing functionality from React Query and Redux Toolkit.
