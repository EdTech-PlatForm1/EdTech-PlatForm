import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WishlistService, WishlistItem } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  loading = false;
  error = '';

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    public router: Router
  ) {}

  ngOnInit() {
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItems = items;
    });
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.wishlistService.getWishlist().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load wishlist.';
        this.loading = false;
      }
    });
  }

  onRemoveFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe(() => {
      this.loadWishlist();
    });
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
