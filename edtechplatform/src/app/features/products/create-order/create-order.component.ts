import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order, CreateOrderPayload } from '../../../core/services/order.service';
import { ProductService, Product } from '../../../core/services/product.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error = '';
  message = '';

  orderForm = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\-\(\)\s]+$/)]],
    paymentMethod: ['card', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(id: string) {
    this.productService.getSingleProduct(id).subscribe({
      next: (product: Product) => {
        this.product = product;
      },
      error: (err: any) => {
        this.error = 'Failed to load product details.';
      }
    });
  }

  onSubmit() {
    if (this.orderForm.invalid || !this.product) {
      this.error = 'Please fill in all fields correctly.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const orderData: CreateOrderPayload = {
      productId: this.product._id,
      quantity: this.orderForm.value.quantity!,
      address: this.orderForm.value.address!,
      phone: this.orderForm.value.phone!,
      paymentMethod: this.orderForm.value.paymentMethod!
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order: Order) => {
        this.message = 'Order created successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 2000);
      },
      error: (err: any) => {
        this.error = err.message || 'Failed to create order.';
        this.loading = false;
      }
    });
  }

  getTotalPrice(): number {
    if (!this.product) return 0;
    return this.product.price * (this.orderForm.value.quantity || 1);
  }
}