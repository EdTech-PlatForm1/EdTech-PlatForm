import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  isAdminView = false;
  isLoggedIn = false;
  cartCount = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.authService.isAuthenticated();
        this.isAdminView = this.isLoggedIn && event.urlAfterRedirects.includes('/admin');
      }
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.length;
    });
  }
}