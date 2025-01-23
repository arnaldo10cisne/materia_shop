import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import cartReducer from "./cartReducer";
import orderReducer from "./orderReducer";
import creditCardReducer from "./creditCardReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    creditCard: creditCardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
