export interface Checkout {
  cardHolderName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  totalAmount: number;
  cartItems: CartItem[];
  customerId: number;
}

import { CartItem } from './cart-item';
