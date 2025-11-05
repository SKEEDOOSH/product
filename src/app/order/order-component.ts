import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth.service';
import { OrderItem } from '../model/order-item';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order-component.html',
  styleUrls: ['./order-component.css'],
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
})
export class OrderComponent implements OnInit, OnDestroy {
  order: OrderItem[] = [];
  private subs = new Subscription();

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to BehaviorSubject updates
    const sub1 = this.orderService.currentOrder$.subscribe((currentOrder) => {
      this.order = [...currentOrder];
    });
    this.subs.add(sub1);

    // Load all orders from backend
    this.fetchOrdersFromBackend();

    // Refresh if navigated back to /order
    const sub2 = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url.startsWith('/order')) {
          this.fetchOrdersFromBackend();
        }
      });
    this.subs.add(sub2);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  cancelOrder(item: OrderItem): void {
    if (!item.id) return;

    this.orderService.cancelOrder(item.id).subscribe({
      next: (updated) => {
        this.order = this.order.map((o) =>
          o.id === item.id ? { ...o, status: 'Cancelled' } : o
        );
      },
      error: (err) => console.error('❌ Failed to cancel order', err),
    });
  }

  deleteOrder(item: OrderItem): void {
    if (!item.id) return;

    this.orderService.deleteOrder(item.id).subscribe({
      next: () => {
        this.order = this.order.filter((o) => o.id !== item.id);
      },
      error: (err) => console.error('❌ Failed to delete order', err),
    });
  }

  private fetchOrdersFromBackend(): void {
    const customerId = this.authService.getCustomerId();
    if (customerId == null) {
      this.order = [];
      return;
    }

    this.orderService.getOrdersByCustomer(customerId).subscribe({
      next: (res) => {
        const formatted = (res || []).map((item) => ({
          ...item,
          name: item.productName || item.name || 'Unnamed Item',
        }));
        this.order = formatted;
        this.orderService.setCurrentOrder(formatted);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.order = [];
      },
    });
  }
}
