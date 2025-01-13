import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  OrderModel,
  OrderStatus,
  CartItem,
  UserModel,
} from "../utils/models.ts";
// import { RootState } from "./store.ts"; // Ajusta la ruta según tu configuración

interface OrderStateModel {
  currentOrder: OrderModel | null;
}

const initialState: OrderStateModel = {
  currentOrder: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<UserModel>) => {
      state.currentOrder = {
        id: crypto.randomUUID(), // Generate unique ID
        User: action.payload,
        creation_date: new Date(),
        content: [],
        status: OrderStatus.IN_PROGRESS,
      };
    },
    updateOrderStatus: (state, action: PayloadAction<OrderStatus>) => {
      if (state.currentOrder) {
        state.currentOrder.status = action.payload;
      }
    },
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      if (state.currentOrder) {
        state.currentOrder.content.push(action.payload);
      }
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      if (state.currentOrder) {
        state.currentOrder.content = state.currentOrder.content.filter(
          (item) => item.id !== action.payload,
        );
      }
    },
    clearCartContent: (state) => {
      if (state.currentOrder) {
        state.currentOrder.content = [];
      }
    },
  },
});

export const {
  createOrder,
  updateOrderStatus,
  addCartItem,
  removeCartItem,
  clearCartContent,
} = orderSlice.actions;
export default orderSlice.reducer;

// Ejemplo de uso con el estado global y el userReducer
// export const createOrderWithSelectedUser = () => (
//   dispatch: any,
//   getState: () => RootState
// ) => {
//   const { user } = getState();
//   if (user.selectedUser) {
//     dispatch(createOrder(user.selectedUser));
//   } else {
//     console.error("No user selected to create the order.");
//   }
// };
