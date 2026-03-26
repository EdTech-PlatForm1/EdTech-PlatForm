import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Order {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  address: string;
  phone: string;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  totalPrice: number;
  shippingCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  productId: string;
  quantity: number;
  address: string;
  phone: string;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly endpoint = 'http://localhost:4004';

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(`${this.endpoint}/api/createorders`, orderData).pipe(
      catchError(this.handleError)
    );
  }

  getUserOrderHistory(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.endpoint}/api/historyOrder`).pipe(
      catchError(this.handleError)
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.endpoint}/api/getAllOrders`).pipe(
      catchError(this.handleError)
    );
  }

  getSingleOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.endpoint}/api/getsingleOrder/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateOrder(id: string, updateData: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`${this.endpoint}/api/update-order/${id}`, updateData).pipe(
      catchError(this.handleError)
    );
  }

  cancelOrder(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/api/cancelOrder/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'An unexpected error occurred.';
    if (error.error && error.error.message) {
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'Connection error.';
    } else if (error.status >= 400 && error.status < 500) {
      message = 'Invalid data provided.';
    }
    return throwError(() => new Error(message));
  }
}