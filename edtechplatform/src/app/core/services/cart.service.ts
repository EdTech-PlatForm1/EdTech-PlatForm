import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = new BehaviorSubject<any[]>([]);
  cart$ = this.cartItems.asObservable();

  addToCart(product: any) {
    const currentItems = this.cartItems.value;
    this.cartItems.next([...currentItems, product]);
    console.log('Product added to cart:', product);
  }

  getCartCount() {
    return this.cartItems.value.length;
  }
}