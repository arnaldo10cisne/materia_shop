export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum CreditCardCompany {
  VISA = "VISA",
  MASTER_CARD = "MASTER_CARD",
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
  total_order_prince: number;
}

export interface CreditCardModel {
  id: string;
  company: CreditCardCompany;
  last_four_digits: string;
  encrypted_data?: string;
  sensitive_data?: CreditCardSensitiveDataModel;
}

export interface CreditCardSensitiveDataModel {
  company: CreditCardCompany;
  number: string;
  expiration_date: Date;
  secret_code: number;
  holder_name: string;
}

export interface PaymentModel {
  id: string;
  credit_card?: CreditCardModel;
  status: PaymentStatus;
}

export interface MateriaIconModel {
  type: MateriaTypes;
  src: string;
}

export interface CreditCardIconModel {
  company: CreditCardCompany;
  src: string;
}
