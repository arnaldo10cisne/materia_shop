export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
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
  product: string;
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
  payment_method: PaymentModel; // ID de PaymentModel
  total_order_price: number;
  acceptance_auth_token?: string;
  acceptance_token?: string;
}

export interface CreditCardModel {
  id: string;
  company: CreditCardCompany;
  last_four_digits: number;
}

export interface PaymentModel {
  id: string;
  credit_card: CreditCardModel;
  tokenized_credit_card: string;
  payment_status: PaymentStatus;
  customer_email: string;
  payment_amount: string;
  order: OrderModel;
  wompiTransactionId?: string;
  acceptance_auth_token?: string;
  acceptance_token?: string;
}
