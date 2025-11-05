export interface CartItem {
  cartId?: number;       // Backend DTO field, optional for adding new items
  productId: number;
  productName: string;
  categoryName: string;
  price: number;
  quantity: number;
}
