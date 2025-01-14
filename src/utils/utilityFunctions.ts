import cursorAcceptAudio from "../assets/sfx/Cursor-Accept.mp3";
import cursorMoveAudio from "../assets/sfx/Cursor-Move.mp3";
import cursorBuzzerAudio from "../assets/sfx/Cursor-Buzzer.mp3";
import cursorCancelAudio from "../assets/sfx/Cursor-Cancel.mp3";
import purchaseAudio from "../assets/sfx/Purchase.mp3";
import chocoboDance from "../assets/sfx/Chocobo-dance.mp3";
import chocoboCry from "../assets/sfx/Chocobo-cry.mp3";
import { CartItem } from "./models.ts";
import { API_ADDRESS } from "./constants.ts";

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
