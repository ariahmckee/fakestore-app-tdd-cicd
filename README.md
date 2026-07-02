# FakeStore E-Commerce App

React e-commerce storefront with product browsing, Firebase-backed user features, cart state management, automated tests, and a GitHub Actions CI/CD pipeline that deploys to Vercel.

## Live Application

[View the deployed app](https://fakestore-app-tdd-cicd.vercel.app)

## Features

- Responsive storefront built with React, Vite, React Bootstrap, and custom CSS
- Product catalog with category filtering and product detail pages
- Seeded product fallback when the Firestore `products` collection is empty
- Firebase authentication for user sign-up and login
- Firestore-backed user profiles and order history
- Redux Toolkit cart with add, remove, quantity update, and checkout flows
- Cart persistence with `sessionStorage`
- Admin-protected product create, edit, and delete tools
- Unit and integration tests with Vitest and React Testing Library
- GitHub Actions workflow for install, test, build, and Vercel deployment

## Tech Stack

- React 19
- Vite
- React Router
- TanStack React Query
- Redux Toolkit
- React Redux
- Firebase Authentication and Firestore
- Axios
- React Bootstrap and Bootstrap
- Vitest
- React Testing Library
- GitHub Actions
- Vercel

## Testing

This project includes component unit tests and a cart integration test.

```bash
npm test
```

Current test coverage includes:

- `RatingStars` rendering and unavailable rating fallback
- `ProductCard` rendering and add-to-cart Redux interaction
- Cart integration flow confirming the cart UI updates after adding a product

For local TDD/watch mode:

```bash
npm run test:watch
```

## CI/CD Pipeline

The workflow file is located at `.github/workflows/main.yml`.

On pushes and pull requests to `main`, GitHub Actions:

1. Installs dependencies with `npm ci`
2. Runs the test suite with `npm test`
3. Builds the app with `npm run build`

On successful pushes to `main`, the deployment job:

1. Pulls the Vercel production environment
2. Builds production artifacts with the Vercel CLI
3. Deploys the prebuilt output to Vercel

The deployment job requires these GitHub Actions repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Environment Variables

Create a local `.env` file for Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Add the same `VITE_FIREBASE_*` values in the Vercel project environment variable settings for production.

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

Preview the production build locally:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Project Structure

```text
src/
  components/    Reusable UI components
  context/       Authentication context and hooks
  pages/         Route-level page components
  services/      Firebase/API data helpers
  store/         Redux Toolkit store and cart slice
  test/          Shared test setup, utilities, and integration tests
```

## Notes

Firestore is the primary product data source when Firebase is configured. If the Firestore `products` collection is empty, the app falls back to a seeded local product catalog so the deployed storefront remains usable.

The cart uses `sessionStorage`, so cart contents persist during the current browser session and clear after checkout.
