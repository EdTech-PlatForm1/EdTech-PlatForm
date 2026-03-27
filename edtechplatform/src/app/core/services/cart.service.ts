import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    if (typeof localStorage !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItemsSubject.next(JSON.parse(savedCart));
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

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = [...this.getCartItems()];
    const existingItem = currentItems.find(item => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.saveCart(currentItems);
  }

  removeFromCart(productId: string) {
    const currentItems = this.getCartItems().filter(item => item.product._id !== productId);
    this.saveCart(currentItems);
  }

  updateQuantity(productId: string, quantity: number) {
    const currentItems = [...this.getCartItems()];
    const item = currentItems.find(item => item.product._id === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.saveCart(currentItems);
    }
  }

  clearCart() {
    this.saveCart([]);
  }

  getTotalAmount(): number {
    return this.getCartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getCartCount(): number {
    return this.getCartItems().reduce((count, item) => count + item.quantity, 0);
  }
}
