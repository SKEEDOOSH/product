import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../model/cart-item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080'; // Base URL for backend

  constructor(private http: HttpClient) { }

  getCart(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/cart/${userId}`);
  }

  addToCart(cartItem: CartItem, userId: number): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/cart/${userId}`, cartItem);
  }

  removeCartItem(userId: number, cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cart/${userId}/${cartId}`);
  }

  clearCart(userId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/cart/clear/${userId}`);
}

}
