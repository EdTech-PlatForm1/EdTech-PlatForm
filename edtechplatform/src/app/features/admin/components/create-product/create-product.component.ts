import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {
  productData = {
    productName: '',
    description: '',
    price: 0,
    discount: 0,
    category: '',
    stock: 0
  };
  selectedFiles: File[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    const formData = new FormData();
    formData.append('productName', this.productData.productName);
    formData.append('description', this.productData.description);
    formData.append('price', this.productData.price.toString());
    formData.append('discount', this.productData.discount.toString());
    formData.append('category', this.productData.category);
    formData.append('stock', this.productData.stock.toString());

    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    this.productService.createProduct(formData).subscribe({
      next: () => {
        alert('Product created successfully!');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        this.error = err.message || 'Failed to create product.';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}
