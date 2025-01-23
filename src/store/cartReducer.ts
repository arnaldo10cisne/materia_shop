import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../utils/models";

interface CartStateModel {
  currentCart: CartItem[];
}

const initialState: CartStateModel = {
  currentCart: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addOrUpdateCartItem: (state, action: PayloadAction<CartItem>) => {
      const index = state.currentCart.findIndex(
        (item) => item.product.id === action.payload.product.id,
      );

      if (index !== -1) {
        state.currentCart[index] = action.payload;
      } else {
        state.currentCart.push(action.payload);
      }
    },
    removeCartItem: (state, action: PayloadAction<CartItem>) => {
      state.currentCart = state.currentCart.filter(
        (item) => item.product.id !== action.payload.product.id,
      );
    },
    clearCartContent: (state) => {
      state.currentCart = [];
    },
  },
});

export const { addOrUpdateCartItem, removeCartItem, clearCartContent } =
  cartSlice.actions;
export default cartSlice.reducer;
