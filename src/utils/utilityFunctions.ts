import cursorAcceptAudio from "../assets/sfx/Cursor-Accept.mp3";
import cursorMoveAudio from "../assets/sfx/Cursor-Move.mp3";
import cursorBuzzerAudio from "../assets/sfx/Cursor-Buzzer.mp3";
import cursorCancelAudio from "../assets/sfx/Cursor-Cancel.mp3";
import cursorEquip from "../assets/sfx/Cursor-Equip.mp3";
import addToCartSfx from "../assets/sfx/Item.mp3";
import removeFromCartSfx from "../assets/sfx/Jump.mp3";
import purchaseAudio from "../assets/sfx/Purchase.mp3";
import eraseSfx from "../assets/sfx/Erase.mp3";
import chocoboDance from "../assets/sfx/Chocobo-dance.mp3";
import chocoboCry from "../assets/sfx/Chocobo-cry.mp3";
import {
  CartItem,
  CreditCardModel,
  OrderModel,
  OrderStatus,
} from "./models.ts";
import {
  API_ADDRESS,
  WOMPI_PUBLIC_KEY,
  WOMPI_SANDBOX_API,
} from "./constants.ts";

export const disableScroll = () => {
  document.body.style.overflow = "hidden";
};

export const enableScroll = () => {
  document.body.style.overflow = "";
};

export const playMoveCursorSfx = () => {
  const sfx = new Audio(cursorMoveAudio);
  sfx.volume = 0.2;
  if (sfx) {
    sfx
      .play()
      ?.catch((err) => console.error("Error playing Cursor-Move sfx:", err));
  }
};

export const playAcceptCursorSfx = () => {
  const sfx = new Audio(cursorAcceptAudio);
  sfx.volume = 0.2;
  if (sfx) {
    sfx
      .play()
      ?.catch((err) => console.error("Error playing Cursor-Accept sfx:", err));
  }
};

export const playCancelCursorSfx = () => {
  const sfx = new Audio(cursorCancelAudio);
  sfx.volume = 0.2;
  if (sfx) {
    sfx
      .play()
      ?.catch((err) => console.error("Error playing Cursor-Cancel sfx:", err));
  }
};

export const playBuzzerCursorSfx = () => {
  const sfx = new Audio(cursorBuzzerAudio);
  sfx.volume = 0.2;
  if (sfx) {
    sfx
      .play()
      ?.catch((err) => console.error("Error playing Cursor-Buzzer sfx:", err));
  }
};

export const playCursorEquipSfx = () => {
  const sfx = new Audio(cursorEquip);
  sfx.volume = 0.2;
  if (sfx) {
    sfx
      .play()
      ?.catch((err) => console.error("Error playing Cursor-Equip sfx:", err));
  }
};

export const playAddToCart = () => {
  const sfx = new Audio(addToCartSfx);
  sfx.volume = 0.2;
  if (sfx) {
    sfx
      .play()
      ?.catch((err) => console.error("Error playing addToCartSfx:", err));
  }
};

export const playRemoveFromCart = () => {
  const sfx = new Audio(removeFromCartSfx);
  sfx.volume = 0.2;
  if (sfx) {
    sfx
      .play()
      ?.catch((err) => console.error("Error playing removeFromCartSfx:", err));
  }
};

export const playErase = () => {
  const sfx = new Audio(eraseSfx);
  sfx.volume = 0.2;
  if (sfx) {
    sfx.play()?.catch((err) => console.error("Error playing eraseSfx:", err));
  }
};

export const playPurchaseSfx = () => {
  const sfx = new Audio(purchaseAudio);
  sfx.volume = 0.2;
  if (sfx) {
    sfx
      .play()
      ?.catch((err) => console.error("Error playing Purchase sfx:", err));
  }
};

export const playChocoboDance = () => {
  const sfx = new Audio(chocoboDance);
  sfx.volume = 0.2;
  if (sfx) {
    sfx
      .play()
      ?.catch((err) => console.error("Error playing chocoboDance sfx:", err));
  }
};

export const playChocoboCry = () => {
  const sfx = new Audio(chocoboCry);
  sfx.volume = 0.5;
  if (sfx) {
    sfx
      .play()
      ?.catch((err) => console.error("Error playing chocoboCry sfx:", err));
  }
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

export const getStylizedNumber = (number: string): string => {
  const numberRegex = /^-?\d+(\.\d+)?$/;
  if (!numberRegex.test(number)) {
    console.error(`Failed converting '${number}' into Number type: NaN `);
    return number;
  }
  const digitRegex = /^[0-9]$/;
  let stylizedNumber = "";
  for (const digit of number) {
    if (digitRegex.test(digit)) {
      const subscriptCharCode = 0x2080 + parseInt(digit);
      stylizedNumber += String.fromCharCode(subscriptCharCode);
    } else {
      stylizedNumber += digit;
    }
  }
  return stylizedNumber;
};

/// API CALLS UTILITIES

// Reusable fetch handler
const fetchData = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
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

export const restockProducts = async () => {
  return await fetchData(`${API_ADDRESS}/products/restock`);
};

interface CreatedOrderModel {
  order_id: string;
  content: [];
  user_id: string;
  total_order_price: number;
  address: string;
  acceptance_auth_token: string;
  acceptance_token: string;
  customer_email: string;
  tokenized_credit_card: string;
}

export const createOrderInBackend = async ({
  order_id,
  user_id,
  content,
  total_order_price,
  address,
  acceptance_auth_token,
  acceptance_token,
  customer_email,
  tokenized_credit_card,
}: CreatedOrderModel): Promise<OrderModel | null> => {
  const controller = new AbortController();
  const timeout = 34000;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(`${API_ADDRESS}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: order_id,
        user_id: user_id,
        acceptance_token: acceptance_token,
        acceptance_auth_token: acceptance_auth_token,
        address: address,
        content: content,
        creation_date: formatTimestampToReadableDate(Date.now()),
        order_status: OrderStatus.PENDING,
        total_order_price: total_order_price,
        customer_email: customer_email,
        tokenized_credit_card: tokenized_credit_card,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error: ${response.status} - ${response.statusText}. Details: ${errorText}`,
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("createOrderInBackend Request aborted due to timeout");
    } else {
      console.error("Error making POST request:", error);
    }
    return null;
  }
};

// WOMPI UTILITIES

export const getCreditCardToken = async (
  credit_card: CreditCardModel,
): Promise<string> => {
  try {
    const response = await fetch(`${WOMPI_SANDBOX_API}/tokens/cards`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WOMPI_PUBLIC_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number: credit_card.sensitive_data?.number,
        cvc: credit_card.sensitive_data?.secret_code as string,
        exp_month: credit_card.sensitive_data?.exp_month,
        exp_year: credit_card.sensitive_data?.exp_year,
        card_holder: credit_card.sensitive_data?.holder_name,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error making POST request:", errorData);
      throw new Error(`Fetch error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return String(data.data.id);
  } catch (error) {
    console.error("Error making POST request:", error);
    return "ERROR";
  }
};

export const getAcceptanceTokens = async () => {
  const response = await fetchData(
    `${WOMPI_SANDBOX_API}/merchants/${WOMPI_PUBLIC_KEY}`,
  );
  return {
    acceptance_token: response.data.presigned_acceptance.acceptance_token,
    acceptance_token_permalink: response.data.presigned_acceptance.permalink,
    acceptance_auth_token:
      response.data.presigned_personal_data_auth.acceptance_token,
    acceptance_auth_token_permalink:
      response.data.presigned_personal_data_auth.permalink,
  };
};
