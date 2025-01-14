import cursor_pointer from "../assets/icons/FF7Cursor.png";
import cloud_portrait_placeholder from "../assets/icons/Cloud_Portrait_Placeholder.webp";
import magic_materia_icon from "../assets/icons/FFVII_Magic_Materia_Icon.png";
import summon_materia_icon from "../assets/icons/FFVII_Summon_Materia_Icon.png";
import support_materia_icon from "../assets/icons/FFVII_Support_Materia_Icon.png";
import independent_materia_icon from "../assets/icons/FFVII_Independent_Materia_Icon.png";
import command_materia_icon from "../assets/icons/FFVII_Command_Materia_Icon.png";
import mc_logo from "../assets/images/mc_logo.png";
import visa_logo from "../assets/images/visa_logo.png";
import other_logo from "../assets/images/other_logo.png";
import deliveryChocobo from "../assets/images/delivery_chocobo.gif";
import fatChocobo from "../assets/images/fat_chocobo.gif";
import {
  CreditCardCompany,
  CreditCardIconModel,
  MateriaIconModel,
  MateriaTypes,
} from "./models.ts";

export const API_ADDRESS = "http://localhost:8000";
export const WOMPI_SANDBOX_API = "https://api-sandbox.co.uat.wompi.dev/v1";
export const WOMPI_PUBLIC_KEY = "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7";

export const CURSOR_POINTER = cursor_pointer;
export const CLOUD_PORTRAIT_PLACEHOLDER = cloud_portrait_placeholder;

export const DELIVERY_CHOCOBO_IMAGE = deliveryChocobo;
export const FAT_CHOCOBO_IMAGE = fatChocobo;

export const MASTERCARD_CARD: CreditCardIconModel = {
  company: CreditCardCompany.MASTER_CARD,
  src: mc_logo,
};

export const VISA_CARD: CreditCardIconModel = {
  company: CreditCardCompany.VISA,
  src: visa_logo,
};

export const OTHER_CARD: CreditCardIconModel = {
  company: CreditCardCompany.OTHER,
  src: other_logo,
};

export const CARD_COMPANY_LIST: CreditCardIconModel[] = [
  MASTERCARD_CARD,
  VISA_CARD,
  OTHER_CARD,
];

export const MAGIC_MATERIA: MateriaIconModel = {
  type: MateriaTypes.MAGIC,
  src: magic_materia_icon,
};

export const SUMMON_MATERIA: MateriaIconModel = {
  type: MateriaTypes.SUMMON,
  src: summon_materia_icon,
};

export const SUPPORT_MATERIA: MateriaIconModel = {
  type: MateriaTypes.SUPPORT,
  src: support_materia_icon,
};

export const COMMAND_MATERIA: MateriaIconModel = {
  type: MateriaTypes.COMMAND,
  src: command_materia_icon,
};

export const INDEPENDENT_MATERIA: MateriaIconModel = {
  type: MateriaTypes.INDEPENDENT,
  src: independent_materia_icon,
};

export const MATERIA_LIST: MateriaIconModel[] = [
  MAGIC_MATERIA,
  SUMMON_MATERIA,
  COMMAND_MATERIA,
  INDEPENDENT_MATERIA,
  SUPPORT_MATERIA,
];
