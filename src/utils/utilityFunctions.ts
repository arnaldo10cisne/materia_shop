import cursorAcceptAudio from "../assets/sfx/Cursor-Accept.mp3";
import cursorMoveAudio from "../assets/sfx/Cursor-Move.mp3";
import cursorBuzzerAudio from "../assets/sfx/Cursor-Buzzer.mp3";
import cursorCancelAudio from "../assets/sfx/Cursor-Cancel.mp3";
import purchaseAudio from "../assets/sfx/Purchase.mp3";
import chocoboDance from "../assets/sfx/Chocobo-dance.mp3";
import chocoboCry from "../assets/sfx/Chocobo-cry.mp3";
import {
  CartItem,
  CreditCardModel,
  OrderStatus,
  PaymentStatus,
} from "./models.ts";
import {
  API_ADDRESS,
  WOMPI_PUBLIC_KEY,
  WOMPI_SANDBOX_API,
} from "./constants.ts";
import axios from "axios";

export const disableScroll = () => {
  document.body.style.overflow = "hidden";
};

export const enableScroll = () => {
  document.body.style.overflow = "";
};

export const playMoveCursorSfx = () => {
  const sfx = new Audio(cursorMoveAudio);
  sfx
    .play()
    .catch((err) => console.error("Error playing Cursor-Move sfx:", err));
};

export const playAcceptCursorSfx = () => {
  const sfx = new Audio(cursorAcceptAudio);
  sfx
    .play()
    .catch((err) => console.error("Error playing Cursor-Accept sfx:", err));
};

export const playCancelCursorSfx = () => {
  const sfx = new Audio(cursorCancelAudio);
  sfx
    .play()
    .catch((err) => console.error("Error playing Cursor-Cancel sfx:", err));
};

export const playBuzzerCursorSfx = () => {
  const sfx = new Audio(cursorBuzzerAudio);
  sfx
    .play()
    .catch((err) => console.error("Error playing Cursor-Buzzer sfx:", err));
};

export const playPurchaseSfx = () => {
  const sfx = new Audio(purchaseAudio);
  sfx.play().catch((err) => console.error("Error playing Purchase sfx:", err));
};

export const playChocoboDance = () => {
  const sfx = new Audio(chocoboDance);
  sfx
    .play()
    .catch((err) => console.error("Error playing chocoboDance sfx:", err));
};

export const playChocoboCry = () => {
  const sfx = new Audio(chocoboCry);
  sfx
    .play()
    .catch((err) => console.error("Error playing chocoboCry sfx:", err));
};

export const calculateOrderPrice = (
  cartItems: CartItem[],
  addCcFee = false,
  includeDeliveryFee = false,
): number => {
  const sum_of_items = cartItems.reduce(
    (total, item) => total + (item.total_price || 0),
    0,
  );

  const cc_fee = addCcFee ? parseFloat((sum_of_items * 0.14).toFixed(2)) : 0;
  const delivery_fee = includeDeliveryFee ? 750 : 0;

  return sum_of_items + cc_fee + delivery_fee;
};

export const formatTimestampToReadableDate = (timestamp) => {
  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year}-${hours}:${minutes}:${seconds}`;
};

/// API CALLS UTILITIES

// Reusable fetch handler
const fetchData = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error: ${response.status} - ${response.statusText}. Details: ${errorText}`,
    );
  }

  return await response.json();
};

export const getAllUsers = async () => {
  return await fetchData(`${API_ADDRESS}/users`);
};

export const getAllProducts = async () => {
  return await fetchData(`${API_ADDRESS}/products`);
};

interface CreatedOrderModel {
  content: [];
  user_id: string;
  payment_method: {
    id: string;
    tokenized_credit_card: string;
    payment_status: PaymentStatus;
    order: string;
  };
  total_order_price: number;
  address: string;
}

export const createOrderInBackend = async ({
  user_id,
  content,
  payment_method,
  total_order_price,
  address,
}: CreatedOrderModel) => {
  try {
    const response = await axios.post(`${API_ADDRESS}/orders`, {
      content,
      order_status: OrderStatus.PENDING,
      user_id,
      payment_method,
      total_order_price,
      address,
      creation_date: formatTimestampToReadableDate(Date.now()),
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error making POST request:", error);
  }
};

// WOMPI UTILITIES

export const getCreditCardToken = async (
  credit_card: CreditCardModel,
): Promise<string> => {
  try {
    const response = await axios.post(
      `${WOMPI_SANDBOX_API}/tokens/cards`,
      {
        number: credit_card.sensitive_data?.number,
        cvc: credit_card.sensitive_data?.secret_code as string,
        exp_month: credit_card.sensitive_data?.exp_month,
        exp_year: credit_card.sensitive_data?.exp_year,
        card_holder: credit_card.sensitive_data?.holder_name,
      },
      {
        headers: {
          Authorization: `Bearer ${WOMPI_PUBLIC_KEY}`,
        },
      },
    );
    return String(response.data.data.id); // Token of CC
  } catch (error) {
    console.error(
      "Error making POST request:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
