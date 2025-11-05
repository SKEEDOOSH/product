import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Checkout } from '../model/checkout';
import { CartItem } from '../model/cart-item';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  checkoutData: Checkout | null = null; // Add this

  cardHolderName = '';
  cardNumber = '';
  expirationDate = '';
  cvv = '';
  totalAmount = 0;
  cartItems: CartItem[] = [];

  constructor(private router: Router, private authService: AuthService) {
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    if (state) {
      this.cartItems = state.cartItems;
      this.totalAmount = state.total;
    }

    // initialize checkoutData if you already have cartItems
    this.checkoutData = {
      cardHolderName: this.cardHolderName,
      cardNumber: this.cardNumber,
      expirationDate: this.expirationDate,
      cvv: this.cvv,
      totalAmount: this.totalAmount,
      cartItems: this.cartItems,
      customerId: this.authService.getCustomerId(),
    };
  }

  proceedToOrder() {
    // update checkoutData before navigating
    this.checkoutData = {
      cardHolderName: this.cardHolderName,
      cardNumber: this.cardNumber,
      expirationDate: this.expirationDate,
      cvv: this.cvv,
      totalAmount: this.totalAmount,
      cartItems: this.cartItems,
      customerId: this.authService.getCustomerId(),
    };

    this.router.navigate(['/product-order'], { state: this.checkoutData });
  }
}


