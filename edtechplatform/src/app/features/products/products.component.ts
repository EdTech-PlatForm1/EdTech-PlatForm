import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../core/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        console.log('Component received products:', products);
        this.products = products || [];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.message || 'Failed to load products.';
        this.loading = false;
      }
    });
  }
}