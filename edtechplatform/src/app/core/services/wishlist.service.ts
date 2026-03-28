import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<any[]>([]);
  wishlist$ = this.wishlistItems.asObservable();

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        this.wishlistItems.next(JSON.parse(saved));
      }
    }
  }

  addToWishlist(product: any) {
    const current = this.wishlistItems.value;
    if (!current.some(item => item.id === product.id)) {
      const updated = [...current, product];
      this.wishlistItems.next(updated);
      this.saveToLocal(updated);
    }
  }

  removeFromWishlist(productId: any) {
    const updated = this.wishlistItems.value.filter(item => item.id !== productId);
    this.wishlistItems.next(updated);
    this.saveToLocal(updated);
  }

  private saveToLocal(items: any[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }
}
