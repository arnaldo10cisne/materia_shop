import cursor_pointer from "../assets/icons/FF7Cursor.png";
import cloud_portrait_placeholder from "../assets/icons/Cloud_Portrait_Placeholder.webp";
import magic_materia_icon from "../assets/icons/FFVII_Magic_Materia_Icon.png";
import { IconModel, UserModel } from "./models";
import cursorAcceptAudio from "../assets/sfx/Cursor-Accept.mp3";
import cursorMoveAudio from "../assets/sfx/Cursor-Move.mp3";
import cursorBuzzerAudio from "../assets/sfx/Cursor-Buzzer.mp3";
import cursorCancelAudio from "../assets/sfx/Cursor-Cancel.mp3";

export const CURSOR_POINTER = cursor_pointer;
export const CLOUD_PORTRAIT_PLACEHOLDER = cloud_portrait_placeholder;

export const cursorMoveSfx = new Audio(cursorMoveAudio);
export const cursorCancelSfx = new Audio(cursorCancelAudio);
export const cursorAcceptSfx = new Audio(cursorAcceptAudio);
export const cursorBuzzerSfx = new Audio(cursorBuzzerAudio);

export const PLACEHOLDER_CHARACTER: UserModel = {
  id: "1",
  name: "Cloud Strife",
  portrait: CLOUD_PORTRAIT_PLACEHOLDER,
};

export const PLACEHOLDER_CHARACTER_LIST: UserModel[] = [
  {
    id: "1",
    name: "Cloud Strife",
    portrait: CLOUD_PORTRAIT_PLACEHOLDER,
  },
  {
    id: "2",
    name: "Barret Wallace",
    portrait: CLOUD_PORTRAIT_PLACEHOLDER,
  },
  {
    id: "3",
    name: "Tifa Lockhart",
    portrait: CLOUD_PORTRAIT_PLACEHOLDER,
  },
  {
    id: "4",
    name: "Aerith Gainsborough",
    portrait: CLOUD_PORTRAIT_PLACEHOLDER,
  },
  {
    id: "5",
    name: "Red XIII",
    portrait: CLOUD_PORTRAIT_PLACEHOLDER,
  },
  {
    id: "6",
    name: "Yuffie Kisaragi",
    portrait: CLOUD_PORTRAIT_PLACEHOLDER,
  },
  {
    id: "7",
    name: "Cait Sith",
    portrait: CLOUD_PORTRAIT_PLACEHOLDER,
  },
  {
    id: "8",
    name: "Vincent Valentine",
    portrait: CLOUD_PORTRAIT_PLACEHOLDER,
  },
  {
    id: "9",
    name: "Cid Highwind",
    portrait: CLOUD_PORTRAIT_PLACEHOLDER,
  },
  {
    id: "10",
    name: "Sephiroth",
    portrait: CLOUD_PORTRAIT_PLACEHOLDER,
  },
];

export const MAGIC_MATERIA: IconModel = {
  src: magic_materia_icon,
};
