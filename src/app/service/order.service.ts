import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { OrderRequest } from '../model/order-request';
import { OrderItem } from '../model/order-item';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/order';
  private currentOrderSubject = new BehaviorSubject<OrderItem[]>([]);
  currentOrder$ = this.currentOrderSubject.asObservable();

  constructor(private http: HttpClient) {}

  getOrdersByCustomer(customerId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  /**
   * Checkout and merge new orders into current stream without creating duplicates.
   * Backend returns the saved (new) order items. We merge them uniquely by id.
   */
  checkout(orderItems: OrderRequest[]): Observable<OrderItem[]> {
    return this.http.post<OrderItem[]>(`${this.baseUrl}/checkout`, orderItems).pipe(
      tap((newOrders) => {
        const current = this.currentOrderSubject.value ?? [];

        // If new orders do not have ids yet, just prepend them.
        // Otherwise merge uniquely by id (new ones first).
        const newWithId = newOrders.filter(o => o && o.id != null);
        if (newWithId.length === newOrders.length && newWithId.length > 0) {
          const existingMap = new Map<number, OrderItem>();
          current.forEach(c => { if (c.id != null) existingMap.set(c.id, c); });

          // Add current items that are not present in newOrders
          const merged = [
            ...newOrders,
            ...current.filter(c => c.id == null || !newOrders.some(n => n.id === c.id))
          ];
          this.currentOrderSubject.next(merged);
        } else {
          // fallback: just prepend and then de-duplicate by shallow JSON string (safe for small lists)
          const mergedRaw = [...newOrders, ...current];
          const seen = new Set<string>();
          const deduped: OrderItem[] = [];
          for (const it of mergedRaw) {
            const key = JSON.stringify({ id: it.id ?? null, productName: it.productName ?? it.name, quantity: it.quantity, price: it.price });
            if (!seen.has(key)) {
              seen.add(key);
              deduped.push(it);
            }
          }
          this.currentOrderSubject.next(deduped);
        }
      })
    );
  }

  cancelOrder(id: number): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${this.baseUrl}/cancel/${id}`, {});
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  /**
   * Replace current order list (used when we fetch authoritative backend list).
   */
  setCurrentOrder(order: OrderItem[] | OrderItem) {
    const items = Array.isArray(order) ? order : [order];
    this.currentOrderSubject.next(items);
  }

  getCurrentOrder(): OrderItem[] {
    return this.currentOrderSubject.value;
  }

  clearCurrentOrder() {
    this.currentOrderSubject.next([]);
  }
}
