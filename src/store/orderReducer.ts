import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  OrderModel,
  OrderStatus,
  CartItem,
  UserModel,
  PaymentStatus,
  CreditCardModel,
} from "../utils/models";
import {
  calculateOrderPrice,
  formatTimestampToReadableDate,
} from "../utils/utilityFunctions";

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
        address: string;
        credit_card: CreditCardModel;
      }>,
    ) => {
      state.currentOrder = {
        id: crypto.randomUUID(),
        user: action.payload.user,
        creation_date: formatTimestampToReadableDate(Date.now()),
        content: action.payload.content,
        order_status: OrderStatus.PENDING,
        payment_method: {
          id: crypto.randomUUID(),
          credit_card: action.payload.credit_card,
          status: PaymentStatus.PENDING,
        },
        address: action.payload.address,
        total_order_price: calculateOrderPrice(
          action.payload.content,
          true,
          true,
        ),
      };
    },

    updateOrder: (state, action: PayloadAction<Partial<OrderModel>>) => {
      if (!state.currentOrder) return;

      const { payment_method, ...rest } = action.payload;

      state.currentOrder = {
        ...state.currentOrder,
        ...rest,
      };

      if (payment_method) {
        state.currentOrder.payment_method = {
          ...state.currentOrder.payment_method,
          ...payment_method,
          credit_card: payment_method.credit_card
            ? ({
                ...state.currentOrder.payment_method?.credit_card,
                ...payment_method.credit_card,
              } as CreditCardModel)
            : state.currentOrder.payment_method?.credit_card,
        };
      }
    },

    updateOrderStatus: (state, action: PayloadAction<OrderStatus>) => {
      if (state.currentOrder) {
        state.currentOrder.order_status = action.payload;
      }
    },

    assignCart: (state, action: PayloadAction<CartItem[]>) => {
      if (state.currentOrder) {
        state.currentOrder.content = action.payload;
        state.currentOrder.total_order_price = calculateOrderPrice(
          action.payload,
          true,
          true,
        );
      }
    },

    clearOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const {
  createOrder,
  updateOrder,
  updateOrderStatus,
  assignCart,
  clearOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
