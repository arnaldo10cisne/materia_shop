import cursor_pointer from "../assets/icons/FF7Cursor.png";
import cloud_portrait_placeholder from "../assets/icons/Cloud_Portrait_Placeholder.webp";
import magic_materia_icon from "../assets/icons/FFVII_Magic_Materia_Icon.png";
import summon_materia_icon from "../assets/icons/FFVII_Summon_Materia_Icon.png";
import support_materia_icon from "../assets/icons/FFVII_Support_Materia_Icon.png";
import independent_materia_icon from "../assets/icons/FFVII_Independent_Materia_Icon.png";
import command_materia_icon from "../assets/icons/FFVII_Command_Materia_Icon.png";
import {
  MateriaIconModel,
  MateriaTypes,
  ProductModel,
  UserModel,
} from "./models.ts";

export const CURSOR_POINTER = cursor_pointer;
export const CLOUD_PORTRAIT_PLACEHOLDER = cloud_portrait_placeholder;

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

export const PLACEHOLDER_PRODUCT_LIST: ProductModel[] = [
  // COMMAND Materia
  {
    id: "1",
    name: "Steal",
    description: 'Equips "Steal" command. Allows stealing items from enemies.',
    picture: cloud_portrait_placeholder,
    price: 1200,
    stock_amount: 0,
    is_available: true,
    materia_type: MateriaTypes.COMMAND,
  },
  {
    id: "2",
    name: "Sense",
    description: 'Equips "Sense" command. Allows analyzing enemy stats.',
    picture: cloud_portrait_placeholder,
    price: 1000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.COMMAND,
  },
  {
    id: "3",
    name: "Morph",
    description:
      'Equips "Morph" command. Allows transforming enemies into items.',
    picture: cloud_portrait_placeholder,
    price: 1000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.COMMAND,
  },
  {
    id: "4",
    name: "Manipulate",
    description:
      'Equips "Manipulate" command. Allows controlling enemies in battle.',
    picture: cloud_portrait_placeholder,
    price: 10000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.COMMAND,
  },

  // INDEPENDENT Materia
  {
    id: "5",
    name: "Cover",
    description: "20% chance of intercepting attacks on an ally.",
    picture: cloud_portrait_placeholder,
    price: 2000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.INDEPENDENT,
  },
  {
    id: "6",
    name: "Chocobo Lure",
    description: "Allows encountering Chocobos near chocobo tracks.",
    picture: cloud_portrait_placeholder,
    price: 3000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.INDEPENDENT,
  },
  {
    id: "7",
    name: "Long Range",
    description:
      "Allows full damage from back row and melee attacks on distant enemies.",
    picture: cloud_portrait_placeholder,
    price: 5000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.INDEPENDENT,
  },
  {
    id: "8",
    name: "Counter Attack",
    description: "20% chance of countering attacks with a physical attack.",
    picture: cloud_portrait_placeholder,
    price: 15000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.INDEPENDENT,
  },

  // MAGIC Materia
  {
    id: "9",
    name: "Fire",
    description:
      "Allows the use of Fire magic spells, including Fire, Fira, and Firaga.",
    picture: cloud_portrait_placeholder,
    price: 500,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.MAGIC,
  },
  {
    id: "10",
    name: "Ice",
    description:
      "Allows the use of Ice magic spells, including Blizzard, Blizzara, and Blizzaga.",
    picture: cloud_portrait_placeholder,
    price: 500,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.MAGIC,
  },
  {
    id: "11",
    name: "Earth",
    description:
      "Allows the use of Earth magic spells, including Quake, Quakera, and Quakega.",
    picture: cloud_portrait_placeholder,
    price: 1500,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.MAGIC,
  },
  {
    id: "12",
    name: "Lightning",
    description:
      "Allows the use of Lightning magic spells, including Bolt, Boltra, and Boltga.",
    picture: cloud_portrait_placeholder,
    price: 500,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.MAGIC,
  },
  {
    id: "13",
    name: "Restore",
    description:
      "Allows the use of healing magic spells, including Cure, Cura, and Curaga.",
    picture: cloud_portrait_placeholder,
    price: 750,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.MAGIC,
  },

  // SUMMON Materia
  {
    id: "14",
    name: "Choco/Mog",
    description: "Summons Choco/Mog to trample enemies with Stampede.",
    picture: cloud_portrait_placeholder,
    price: 800,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.SUMMON,
  },
  {
    id: "15",
    name: "Shiva",
    description: "Summons Shiva, the queen of ice, to unleash Diamond Dust.",
    picture: cloud_portrait_placeholder,
    price: 1000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.SUMMON,
  },
  {
    id: "16",
    name: "Ifrit",
    description: "Summons Ifrit, the fiery being that unleashes Hellfire.",
    picture: cloud_portrait_placeholder,
    price: 1500,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.SUMMON,
  },
  {
    id: "17",
    name: "Ramuh",
    description: "Summons Ramuh, the lightning master, to cast Judgment Bolt.",
    picture: cloud_portrait_placeholder,
    price: 2000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.SUMMON,
  },
  {
    id: "18",
    name: "Titan",
    description:
      "Summons Titan to cause a massive earthquake with Gaia’s Wrath.",
    picture: cloud_portrait_placeholder,
    price: 2500,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.SUMMON,
  },

  // SUPPORT Materia
  {
    id: "19",
    name: "Added Effect",
    description:
      "Adds status effects of linked Materia to attacks or defenses.",
    picture: cloud_portrait_placeholder,
    price: 10000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.SUPPORT,
  },
  {
    id: "20",
    name: "All",
    description: "Allows linked Magic Materia to target all enemies or allies.",
    picture: cloud_portrait_placeholder,
    price: 1500,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.SUPPORT,
  },
  {
    id: "21",
    name: "Counter",
    description: "Counters attacks with linked Materia actions.",
    picture: cloud_portrait_placeholder,
    price: 2000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.SUPPORT,
  },
  {
    id: "22",
    name: "Elemental",
    description:
      "Adds elemental properties of linked Materia to attacks or defenses.",
    picture: cloud_portrait_placeholder,
    price: 3000,
    stock_amount: 5,
    is_available: true,
    materia_type: MateriaTypes.SUPPORT,
  },
];
