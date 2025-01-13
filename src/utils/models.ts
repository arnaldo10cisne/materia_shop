export enum OrderStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum CreditCardCompany {
  VISA = "VISA",
  MASTER_CARD = "MASTER_CARD",
  AMEX = "AMEX",
  OTHER = "OTHER",
}

export enum MateriaTypes {
  COMMAND = "COMMAND",
  INDEPENDENT = "INDEPENDENT",
  MAGIC = "MAGIC",
  SUMMON = "SUMMON",
  SUPPORT = "SUPPORT",
}

export interface UserModel {
  id: string;
  name: string;
  portrait: string;
}

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  picture: string;
  price: number;
  stock_amount: number;
  is_available: boolean;
  materia_type: MateriaTypes;
}

export interface CartItem {
  product: ProductModel;
  amount: number;
  total_price?: number;
}

export interface OrderModel {
  id: string;
  user: UserModel;
  address: string;
  creation_date: Date;
  content: CartItem[];
  status: OrderStatus;
  payment_method: PaymentModel | null;
}

export interface CreditCardModel {
  id: string;
  company: CreditCardCompany;
  last_four_digits: number;
}

export interface PaymentModel {
  id: string;
  credit_card: CreditCardModel;
  status: PaymentStatus;
  order: OrderModel;
}

export interface MateriaIconModel {
  type: MateriaTypes;
  src: string;
}
