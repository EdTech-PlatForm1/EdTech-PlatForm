import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../../../core/services/product.service';

@Component({
  selector: 'app-admin-products',
  template: `
    <div class="products-management">
      <div class="header">
        <h2>🛠️ Product Management</h2>
        <p>Edit products, tutorials, and challenges.</p>
        <button class="add-product-btn" (click)="onCreateProduct()">➕ Add New Product</button>
      </div>

      <div *ngIf="loading" class="loading">Loading products...</div>
      <div *ngIf="error" class="alert error">{{ error }}</div>

      <div class="products-table" *ngIf="!loading && products.length > 0">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td><img [src]="product.images?.[0] || '/assets/placeholder.jpg'" class="product-thumb" /></td>
              <td>{{ product.productName }}</td>
              <td>\${{ product.price }}</td>
              <td>{{ product.stock }}</td>
              <td class="table-actions">
                <button class="edit-btn" (click)="onEditProduct(product)">📝 Edit</button>
                <button class="delete-btn" (click)="onDeleteProduct(product._id)">🗑️ Delete</button>
                <div class="crud-links">
                   <button class="link-btn" (click)="onManageTutorials(product)">📹 Tutorials ({{ product.tutorials?.length || 0 }})</button>
                   <button class="link-btn" (click)="onManageChallenges(product)">🧩 Challenges ({{ product.challenges?.length || 0 }})</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  onCreateProduct() {
     this.router.navigate(['/admin/products/create']);
  }

  onEditProduct(product: any) {
     this.router.navigate(['/admin/products/edit', product._id]);
  }

  onDeleteProduct(id: string) {
    if (confirm('Delete this product?')) {
      this.productService.softDeleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  onManageTutorials(product: any) {
    this.router.navigate(['/admin/products/manage', product._id]);
  }

  onManageChallenges(product: any) {
    this.router.navigate(['/admin/products/manage', product._id]);
  }
}
