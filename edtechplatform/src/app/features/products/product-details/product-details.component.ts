import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error = '';
  activeTab: 'info' | 'tutorials' | 'challenges' = 'info';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService
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
      },
      error: (err: any) => {
        this.error = err.message || 'Failed to load product details.';
        this.loading = false;
      }
    });
  }

  setTab(tab: 'info' | 'tutorials' | 'challenges') {
    this.activeTab = tab;
  }

  onBuyNow() {
    if (this.product) {
      this.router.navigate(['/products', this.product._id, 'order']);
    }
  }
}