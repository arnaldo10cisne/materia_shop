import cursorAcceptAudio from "../assets/sfx/Cursor-Accept.mp3";
import cursorMoveAudio from "../assets/sfx/Cursor-Move.mp3";
import cursorBuzzerAudio from "../assets/sfx/Cursor-Buzzer.mp3";
import cursorCancelAudio from "../assets/sfx/Cursor-Cancel.mp3";
import purchaseAudio from "../assets/sfx/Purchase.mp3";

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
