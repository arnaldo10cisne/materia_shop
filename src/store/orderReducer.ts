import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  OrderModel,
  OrderStatus,
  CartItem,
  UserModel,
  PaymentModel,
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
    createOrder: (
      state,
      action: PayloadAction<{
        user: UserModel;
        content: CartItem[];
      }>,
    ) => {
      state.currentOrder = {
        id: crypto.randomUUID(), // Generate unique ID
        user: action.payload.user,
        creation_date: new Date(),
        content: action.payload.content,
        status: OrderStatus.IN_PROGRESS,
        payment_method: null,
        address: "",
      };
    },
    updateOrderStatus: (state, action: PayloadAction<OrderStatus>) => {
      if (state.currentOrder) {
        state.currentOrder.status = action.payload;
      }
    },
    assignCart: (state, action: PayloadAction<CartItem[]>) => {
      if (state.currentOrder) {
        state.currentOrder.content = action.payload;
      }
    },
    updatePaymentMethodAndAddress: (
      state,
      action: PayloadAction<{
        payment_method: PaymentModel;
        address: string;
      }>,
    ) => {
      if (state.currentOrder) {
        state.currentOrder.payment_method = action.payload.payment_method;
        state.currentOrder.address = action.payload.address;
      }
    },
  },
});

export const { createOrder, updateOrderStatus, assignCart } =
  orderSlice.actions;
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
