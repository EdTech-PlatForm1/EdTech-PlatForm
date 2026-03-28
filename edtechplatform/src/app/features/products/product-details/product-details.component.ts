import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ReviewService, Review } from '../../../core/services/review.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error = '';
  activeTab: 'info' | 'tutorials' | 'challenges' | 'reviews' = 'info';
  reviews: Review[] = [];
  newReview = { rating: 5, comment: '' };

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string) {
    this.loading = true;
    this.error = '';
    this.productService.getSingleProduct(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.loading = false;
        this.loadReviews();
      },
      error: (err: any) => {
        this.error = err.message || 'Failed to load product details.';
        this.loading = false;
      }
    });
  }

  loadReviews() {
    this.reviewService.getAllReviews().subscribe((res: any) => {
      const all: Review[] = res.allreviews || [];
      this.reviews = all.filter(r => r.productId === this.product?._id);
    });
  }

  setTab(tab: 'info' | 'tutorials' | 'challenges' | 'reviews') {
    this.activeTab = tab;
  }

  onAddToWishlist() {
    if (this.product) {
      this.wishlistService.addToWishlist(this.product._id).subscribe(() => {
        alert('Added to wishlist!');
      });
    }
  }

  onAddReview() {
    if (this.product && this.newReview.comment) {
      this.reviewService.addReview(this.product._id, this.newReview.rating, this.newReview.comment).subscribe(() => {
        this.loadReviews();
        this.newReview = { rating: 5, comment: '' };
      });
    }
  }

  onAddToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.router.navigate(['/products/cart']);
    }
  }
}