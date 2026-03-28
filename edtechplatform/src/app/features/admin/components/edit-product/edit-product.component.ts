import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../../core/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productId: string = '';
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
  currentImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProduct();
    }
  }

  loadProduct() {
    this.loading = true;
    this.productService.getSingleProduct(this.productId).subscribe({
      next: (product: Product) => {
        this.productData = {
          productName: product.productName,
          description: product.description,
          price: product.price,
          discount: product.discount || 0,
          category: product.category || '',
          stock: product.stock || 0
        };
        this.currentImages = product.images || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load product details.';
        this.loading = false;
      }
    });
  }

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

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        this.error = err.message || 'Failed to update product.';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}
