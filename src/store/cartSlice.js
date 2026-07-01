import { createSlice } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "cart";

const loadCart = () => {
  try {
    const savedCart = sessionStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

const saveCart = (cartItems) => {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
};

const initialState = {
  items: loadCart(),
  showToast: false,
  checkoutMessage: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      state.showToast = true;
      state.checkoutMessage = "";
      saveCart(state.items);
    },
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item.id === productId);

      if (!existingItem) return;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== productId);
      } else {
        existingItem.quantity -= 1;
      }

      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCart(state.items);
    },
    checkout: (state, action) => {
      state.items = [];
      state.checkoutMessage = action.payload || "Checkout complete. Your cart has been cleared.";
      sessionStorage.removeItem(CART_STORAGE_KEY);
    },
    setShowToast: (state, action) => {
      state.showToast = action.payload;
    },
    clearCheckoutMessage: (state) => {
      state.checkoutMessage = "";
    },
  },
});

export const {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  checkout,
  setShowToast,
  clearCheckoutMessage,
} = cartSlice.actions;

export default cartSlice.reducer;
