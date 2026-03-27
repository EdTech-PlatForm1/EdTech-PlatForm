import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order, CreateOrderPayload, OrderProduct } from '../../../core/services/order.service';
import { ProductService, Product } from '../../../core/services/product.service';
import { CartService, CartItem } from '../../../core/services/cart.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  checkoutItems: CartItem[] = [];
  loading = false;
  error = '';
  message = '';
  isSinglePurchase = false;

  orderForm = this.fb.group({
    address: ['', [Validators.required, Validators.minLength(10)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    paymentMethod: ['card', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isSinglePurchase = true;
      this.loadSingleProduct(productId);
    } else {
      this.checkoutItems = this.cartService.getCartItems();
      if (this.checkoutItems.length === 0) {
        this.router.navigate(['/products/cart']);
      }
    }
  }

  loadSingleProduct(id: string) {
    this.loading = true;
    this.productService.getSingleProduct(id).subscribe({
      next: (product: Product) => {
        this.checkoutItems = [{ product, quantity: 1 }];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load product details.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.orderForm.invalid || this.checkoutItems.length === 0) {
      this.error = 'Please fill in all fields correctly.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const products: OrderProduct[] = this.checkoutItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }));

    const orderData: CreateOrderPayload = {
      products,
      address: this.orderForm.value.address!,
      phone: this.orderForm.value.phone!,
      paymentMethod: this.orderForm.value.paymentMethod!
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order: Order) => {
        this.message = 'Order created successfully!';
        this.loading = false;
        if (!this.isSinglePurchase) {
          this.cartService.clearCart();
        }
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
    return this.checkoutItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}