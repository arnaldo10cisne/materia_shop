import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer.ts";
import cartReducer from "./cartReducer.ts";
import orderReducer from "./orderReducer.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
