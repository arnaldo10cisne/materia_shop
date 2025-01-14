export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
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
  user_id: string; // ID de UserModel
  address: string;
  creation_date: Date;
  content: CartItem[];
  order_status: OrderStatus;
  payment_method: string; // ID de PaymentModel
  total_order_price: number;
}

export interface CreditCardModel {
  id: string;
  company: CreditCardCompany;
  last_four_digits: number;
}

export interface PaymentModel {
  id: string;
  credit_card: CreditCardModel;
  payment_status: PaymentStatus;
  order: OrderModel;
}
