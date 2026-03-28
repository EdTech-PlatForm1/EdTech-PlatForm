import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from './product.service';

export interface WishlistItem {
  productId: Product;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly endpoint = 'http://localhost:5001/wishlist';
  private wishlistItemsSubject = new BehaviorSubject<WishlistItem[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getGuestId(): string {
    if (typeof localStorage === 'undefined') return 'default';
    const userJson = localStorage.getItem('auth_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        return user.email || 'default';
      } catch (e) {
        return 'default';
      }
    }
    return 'default';
  }

  getWishlist(): Observable<any> {
    const gid = this.getGuestId();
    return this.http.get<any>(`${this.endpoint}/get/${gid}`).pipe(
      tap(res => {
        if (Array.isArray(res.wishlist)) {
          const items: WishlistItem[] = res.wishlist.map((p: any) => ({ productId: p }));
          this.wishlistItemsSubject.next(items);
        }
      }),
      catchError(this.handleError)
    );
  }

  addToWishlist(productId: string): Observable<any> {
    const guestId = this.getGuestId();
    return this.http.post(`${this.endpoint}/add`, { productId, guestId }).pipe(
      tap(() => this.getWishlist().subscribe()),
      catchError(this.handleError)
    );
  }

  removeFromWishlist(productId: string): Observable<any> {
    const guestId = this.getGuestId();
    return this.http.delete(`${this.endpoint}/remove`, { body: { productId, guestId } }).pipe(
      tap(() => this.getWishlist().subscribe()),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error?.message || 'Wishlist operation failed'));
  }
}
