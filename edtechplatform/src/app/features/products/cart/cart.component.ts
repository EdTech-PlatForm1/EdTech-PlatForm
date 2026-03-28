import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, CartItem } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]> = this.cartService.cartItems$;
  loading = false;

  constructor(
    public cartService: CartService,
    public router: Router
  ) {}

  ngOnInit() {
    // No explicit initialization needed as we'll use async pipe
  }

  onRemoveItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  onUpdateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  onClearCart() {
    this.cartService.clearCart();
  }

  getTotalPrice(): number {
    return this.cartService.getTotalAmount();
  }

  onCheckout() {
    this.router.navigate(['/products/checkout']);
  }
}
