import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import cartReducer from "../store/cartSlice";

export function createTestStore(preloadedState) {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui,
  {
    preloadedState = {
      cart: {
        items: [],
        showToast: false,
        checkoutMessage: "",
      },
    },
    route = "/",
    store = createTestStore(preloadedState),
  } = {},
) {
  const rendered = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
  );

  return {
    store,
    ...rendered,
  };
}
