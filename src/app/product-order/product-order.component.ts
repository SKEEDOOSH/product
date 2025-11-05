import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../model/cart-item';
import { AuthService } from '../service/auth.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { OrderService } from '../service/order.service';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css'],
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
})
export class ProductOrderComponent {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  isProcessing = false;
  errorMessage = '';
  checkoutData: { cartItems: CartItem[]; totalAmount: number } | null = null;
  orderSuccess = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService,
    private cartService: CartService
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state as {
      cartItems?: CartItem[];
      total?: number;
    };

    if (state?.cartItems?.length) {
      // Ensure price/quantity are numeric
      this.cartItems = state.cartItems.map((ci: CartItem) => ({
        ...ci,
        price: Number(ci.price || 0),
        quantity: Number(ci.quantity || 0),
      }));

      this.totalAmount = state.total ?? this.computeTotal(this.cartItems);
      this.checkoutData = {
        cartItems: this.cartItems,
        totalAmount: this.totalAmount,
      };
    } else {
      // No cart items in router state
      this.cartItems = [];
      this.totalAmount = 0;
    }
  }

  /** ✅ Compute total price from cart items */
  private computeTotal(items: CartItem[]): number {
    return (items || []).reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
      0
    );
  }

  /** ✅ Pay and create order items in backend */
  payAndReview(): void {
    if (!this.cartItems.length) return;

    this.isProcessing = true;
    this.errorMessage = '';
    this.orderSuccess = false;

    // Recalculate total for safety
    this.totalAmount = this.computeTotal(this.cartItems);
    this.checkoutData = { cartItems: this.cartItems, totalAmount: this.totalAmount };

    const checkoutRequest = this.cartItems.map((item: CartItem) => ({
      customerId: this.authService.getCustomerId(),
      productId: item.productId,
      productName: item.productName, // ✅ only use productName (no .name)
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
    }));

    this.orderService.checkout(checkoutRequest).subscribe({
      next: () => {
        this.isProcessing = false;
        this.orderSuccess = true;

        this.clearCartAfterPayment();
        this.router.navigate(['/order']);
      },
      error: (err) => {
        console.error('❌ Order checkout failed', err);
        this.isProcessing = false;
        this.errorMessage = 'Failed to complete your order. Please try again.';
      },
    });
  }

  /** ✅ Clear cart after successful payment */
  private clearCartAfterPayment(): void {
    const userId = this.authService.getCustomerId();
    if (!userId) return;

    this.cartService.clearCart(userId).subscribe({
      next: () => console.log('🧹 Cart cleared after payment'),
      error: (err) => console.error('Failed to clear cart:', err),
    });

    this.cartItems = [];
    this.totalAmount = 0;
    this.checkoutData = null;
  }
}
