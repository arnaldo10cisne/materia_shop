import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  OrderModel,
  OrderStatus,
  CartItem,
  UserModel,
  PaymentStatus,
  CreditCardModel,
} from "../utils/models.ts";
import { calculateOrderPrice } from "../utils/utilityFunctions.ts";

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
    // 1. Acción que crea la orden e incluye address y credit_card
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
        id: crypto.randomUUID(), // Generate unique ID
        user: action.payload.user,
        creation_date: new Date(),
        content: action.payload.content,
        status: OrderStatus.IN_PROGRESS,
        payment_method: {
          id: crypto.randomUUID(), // Generate unique ID
          credit_card: action.payload.credit_card,
          status: PaymentStatus.IN_PROGRESS,
        },
        address: action.payload.address,
        total_order_prince: calculateOrderPrice(
          action.payload.content,
          true,
          true,
        ),
      };
    },

    // 2. Acción genérica para hacer un update parcial de la orden
    //    (solo actualizar campos que se manden en el payload)
    updateOrder: (state, action: PayloadAction<Partial<OrderModel>>) => {
      if (!state.currentOrder) return;

      // Extraemos payment_method por si también se quiere actualizar
      const { payment_method, ...rest } = action.payload;

      // Actualizamos la raíz del objeto (lo que no sea payment_method)
      state.currentOrder = {
        ...state.currentOrder,
        ...rest,
      };

      // Si viene algo para payment_method, hacemos un merge profundo
      if (payment_method) {
        state.currentOrder.payment_method = {
          ...state.currentOrder.payment_method,
          ...payment_method,
          credit_card: payment_method.credit_card
            ? ({
                ...state.currentOrder.payment_method?.credit_card,
                ...payment_method.credit_card,
              } as CreditCardModel) // <-- Aquí usamos type assertion
            : state.currentOrder.payment_method?.credit_card,
        };
      }
    },

    // Ejemplo: si quieres seguir teniendo una acción específica para el status
    updateOrderStatus: (state, action: PayloadAction<OrderStatus>) => {
      if (state.currentOrder) {
        state.currentOrder.status = action.payload;
      }
    },

    // Ejemplo: si quisieras cambiar directamente el contenido del cart
    assignCart: (state, action: PayloadAction<CartItem[]>) => {
      if (state.currentOrder) {
        state.currentOrder.content = action.payload;
        state.currentOrder.total_order_prince = calculateOrderPrice(
          action.payload,
          true,
          true,
        );
      }
    },
  },
});

export const { createOrder, updateOrder, updateOrderStatus, assignCart } =
  orderSlice.actions;
export default orderSlice.reducer;
