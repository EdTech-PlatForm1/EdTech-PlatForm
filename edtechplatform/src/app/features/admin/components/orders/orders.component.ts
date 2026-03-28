import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../../../core/services/order.service';

@Component({
  selector: 'app-admin-orders',
  template: `
    <div class="orders-management">
      <div class="header">
        <h2>📦 Order Management</h2>
        <p>Manage customer orders and their delivery statuses.</p>
      </div>

      <div *ngIf="loading" class="loading">Loading orders...</div>
      <div *ngIf="error" class="alert error">{{ error }}</div>

      <div class="orders-grid" *ngIf="!loading && orders.length > 0">
        <div class="order-card" *ngFor="let order of orders">
          <div class="order-header-info">
            <span class="order-id">#{{ order._id.slice(-8) }}</span>
            <span class="order-status" [class]="order.status">{{ order.status }}</span>
          </div>
          <div class="order-details">
            <p><strong>Total:</strong> \${{ order.totalPrice }}</p>
            <p><strong>Address:</strong> {{ order.address.street }}, {{ order.address.city }} ({{ order.address.phone }})</p>
          </div>
          <div class="order-actions" *ngIf="order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'returned'">
            <button class="status-btn confirm" (click)="onConfirmPayment(order._id)" *ngIf="order.status === 'pending'">Confirm Payment</button>
            <button class="status-btn ship" (click)="onShipOrder(order._id)" *ngIf="order.status === 'confirmed'">Ship Order</button>
            <button class="status-btn deliver" (click)="onMarkAsDelivered(order._id)" *ngIf="order.status === 'shipped'">Mark Delivered</button>
          </div>
          <div class="extra-actions">
            <button class="delete-btn" (click)="onDeleteOrder(order._id)">Delete</button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && orders.length === 0" class="empty">
        No orders found.
      </div>
    </div>
  `,
  styleUrls: ['./orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders.';
        this.loading = false;
      }
    });
  }

  onConfirmPayment(id: string) {
    this.orderService.confirmPayment(id).subscribe(() => this.loadOrders());
  }

  onShipOrder(id: string) {
    this.orderService.shipOrder(id).subscribe(() => this.loadOrders());
  }

  onMarkAsDelivered(id: string) {
    this.orderService.markAsDelivered(id).subscribe(() => this.loadOrders());
  }

  onDeleteOrder(id: string) {
    if (confirm('Delete this order?')) {
      this.orderService.softDeleteOrder(id).subscribe(() => this.loadOrders());
    }
  }
}
