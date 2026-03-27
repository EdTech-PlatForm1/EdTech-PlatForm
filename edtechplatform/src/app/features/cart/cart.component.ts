import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service'; 

@Component({
  selector: 'app-cart',
  standalone: false, 
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  }
}