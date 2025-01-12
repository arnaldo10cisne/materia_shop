import cursor_pointer from "../assets/icons/FF7Cursor.png";
import cloud_portrait_placeholder from "../assets/icons/Cloud_Portrait_Placeholder.webp";
import magic_materia_icon from "../assets/icons/FFVII_Magic_Materia_Icon.png";
import { IconModel, UserModel } from "./models";

export const CURSOR_POINTER = cursor_pointer;
export const CLOUD_PORTRAIT_PLACEHOLDER = cloud_portrait_placeholder;

export const PLACEHOLDER_CHARACTER: UserModel = {
  id: "1",
  name: "Cloud Strife",
  portrait: CLOUD_PORTRAIT_PLACEHOLDER,
};

export const MAGIC_MATERIA: IconModel = {
  src: magic_materia_icon,
};
