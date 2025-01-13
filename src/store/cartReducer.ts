import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../utils/models.ts";

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
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      state.currentCart.push(action.payload);
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.currentCart = state.currentCart.filter(
        (item) => item.id !== action.payload,
      );
    },
    clearCartContent: (state) => {
      state.currentCart = [];
    },
  },
});

export const { addCartItem, removeCartItem, clearCartContent } =
  cartSlice.actions;
export default cartSlice.reducer;
