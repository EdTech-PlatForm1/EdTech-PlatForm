import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  user: any;

 
  constructor(
    private authService: AuthService,
    private cartService: CartService 
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  
  addToCart(product: any) {
    this.cartService.addToCart(product);
    
    alert(product.title + ' added to cart!');
  }
  
addToWishlist(product: any) {
  
  alert(product.title + ' added to Wishlist!');
}
}