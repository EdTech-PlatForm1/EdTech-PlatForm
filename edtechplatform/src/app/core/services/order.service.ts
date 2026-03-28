import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Order {
  _id: string;
  userId: string;
  products: {
    product: {
      _id: string;
      productName: string;
      images?: string[];
    };
    quantity: number;
    price: number;
  }[];
  address: {
    street: string;
    city: string;
    country: string;
    phone: string;
  };
  phone: string;
  paymentMethod: string;
  status: 'pending' | 'paid' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  totalPrice: number;
  shippingCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  product: string;
  quantity: number;
}

export interface CreateOrderPayload {
  products: OrderProduct[];
  address: string;
  phone: string;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly endpoint = 'http://localhost:5001/order';

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderPayload): Observable<Order> {
    const payload = {
      products: orderData.products,
      address: { 
        street: orderData.address, 
        city: 'Not specified', 
        country: 'Not specified',
        phone: orderData.phone
      },
      paymentMethod: orderData.paymentMethod
    };
    const headers = { Authorization: 'Bearer ' + (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : '') };
    return this.http.post<Order>(`${this.endpoint}/create`, payload, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getUserOrderHistory(): Observable<Order[]> {
    return this.http.get<any>(`${this.endpoint}/history`).pipe(
      map((res: any) => res.orders || []),
      catchError(this.handleError)
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<any>(`${this.endpoint}/getAll`).pipe(
      map((res: any) => res.orders || []),
      catchError(this.handleError)
    );
  }

  getSingleOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.endpoint}/get/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateOrder(id: string, updateData: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`${this.endpoint}/update/${id}`, updateData).pipe(
      catchError(this.handleError)
    );
  }

  cancelOrder(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/cancel/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  returnOrder(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/return/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  getUserTutorials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/tutorials`).pipe(
      catchError(this.handleError)
    );
  }

  getUserChallenges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/challenges`).pipe(
      catchError(this.handleError)
    );
  }

  getOrderStatus(id: string): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/status/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Admin Order Management
  confirmPayment(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/confirm-payment/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  shipOrder(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/ship/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  markAsDelivered(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/deliver/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  softDeleteOrder(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/soft-delete/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  hardDeleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.endpoint}/hard-delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  restoreOrder(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/restore/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  failOrder(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/fail/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  completeRefund(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/complete-refund/${id}`, {}).pipe(
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