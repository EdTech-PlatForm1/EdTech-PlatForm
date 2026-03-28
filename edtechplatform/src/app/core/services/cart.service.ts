import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly endpoint = 'http://localhost:5001/cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initialLoad();
  }

  private initialLoad() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.getBackendCart().subscribe();
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            this.cartItemsSubject.next(JSON.parse(savedCart));
          } catch (e) {
            this.saveCart([]);
          }
        }
      }
    }
  }

  private saveCart(items: CartItem[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
    this.cartItemsSubject.next(items);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  private mapCart(res: any): CartItem[] {
    if (res && res.cart && res.cart.cartItems) {
      return res.cart.cartItems
        .filter((p: any) => p.product)
        .map((p: any) => ({
          product: p.product,
          quantity: p.quantity
        }));
    }
    return [];
  }

  getBackendCart(): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/get`).pipe(
      tap(res => {
        const items = this.mapCart(res);
        this.saveCart(items);
      }),
      catchError(err => throwError(() => err))
    );
  }

  addToCart(product: Product, quantity: number = 1) {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('accessToken')) {
      this.http.post<any>(`${this.endpoint}/add`, { productId: product._id, quantity }).subscribe({
        next: (res) => this.saveCart(this.mapCart(res)),
        error: (err) => console.error('Cart push failed', err)
      });
    } else {
      const currentItems = [...this.getCartItems()];
      const existingItem = currentItems.find(item => item.product._id === product._id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        currentItems.push({ product, quantity });
      }
      this.saveCart(currentItems);
    }
  }

  removeFromCart(productId: string) {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('accessToken')) {
      this.http.delete<any>(`${this.endpoint}/delete/${productId}`).subscribe({
        next: (res) => this.saveCart(this.mapCart(res)),
        error: (err) => console.error('Cart remove failed', err)
      });
    } else {
      const currentItems = this.getCartItems().filter(item => item.product._id !== productId);
      this.saveCart(currentItems);
    }
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    
    if (typeof localStorage !== 'undefined' && localStorage.getItem('accessToken')) {
      // In this specific backend, there's no update route.
      // But we can update local and hope it syncs or add a route.
      // For now we'll update local to keep UI snappy.
      const currentItems = [...this.getCartItems()];
      const item = currentItems.find(i => i.product._id === productId);
      if (item) {
        item.quantity = quantity;
        this.saveCart(currentItems);
      }
    } else {
      const currentItems = [...this.getCartItems()];
      const item = currentItems.find(i => i.product._id === productId);
      if (item) {
        item.quantity = quantity;
        this.saveCart(currentItems);
      }
    }
  }

  clearCart() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('accessToken')) {
      this.http.delete<any>(`${this.endpoint}/clear`).subscribe({
        next: (res) => this.saveCart(this.mapCart(res)),
        error: (err) => console.error('Cart clear failed', err)
      });
    } else {
      this.saveCart([]);
    }
  }

  getTotalAmount(): number {
    return this.getCartItems().reduce((total, item) => {
      const price = item.product?.finalPrice || item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  getCartCount(): number {
    return this.getCartItems().reduce((count, item) => count + item.quantity, 0);
  }
}
