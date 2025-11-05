import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../service/cart.service';
import { CartItem } from '../model/cart-item';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartItems: CartItem[] = [];
  total: number = 0;
  userId: number = 0;

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    // Get the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.id) {
      alert('Please log in to view your cart');
      return;
    }
    this.userId = user.id;
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart(this.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
      },
      error: (err) => console.error('Error fetching cart items', err)
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
  }

  removeItem(item: CartItem): void {
    if (item.cartId) {
      this.cartService.removeCartItem(this.userId, item.cartId).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(i => i.cartId !== item.cartId);
          this.calculateTotal();
        },
        error: (err) => console.error('Error removing item', err)
      });
    }
  }

  updateQuantity(item: CartItem, event: any): void {
    const newQty = parseInt(event.target.value, 10);
    if (newQty > 0) {
      item.quantity = newQty;
      this.calculateTotal();
      // Optional: call backend to persist quantity change
    }
  }

  // Navigate to Checkout page
  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.router.navigate(['/checkout'], {
      state: {
        cartItems: this.cartItems,
        total: this.total
      }
    });
  }
}
