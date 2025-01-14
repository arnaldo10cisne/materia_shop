import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer.ts";
import cartReducer from "./cartReducer.ts";
import orderReducer from "./orderReducer.ts";
import creditCardReducer from "./creditCardReducer.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    creditCard: creditCardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
