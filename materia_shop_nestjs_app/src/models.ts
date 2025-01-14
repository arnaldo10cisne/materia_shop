export enum OrderStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum CreditCardCompany {
  VISA = 'VISA',
  MASTER_CARD = 'MASTER_CARD',
  AMEX = 'AMEX',
  OTHER = 'OTHER',
}

export interface UserModel {
  id: string;
  name: string;
}

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  picture: string;
  price: number;
  stock_amount: number;
}

export interface CartItem {
  id: string;
  product: ProductModel;
  amount: number;
  total_price?: number;
}

export interface OrderModel {
  id: string;
  User: UserModel;
  creation_date: Date;
  content: CartItem[];
  status: OrderStatus;
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
