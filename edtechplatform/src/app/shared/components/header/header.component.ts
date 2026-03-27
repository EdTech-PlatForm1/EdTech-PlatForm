import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent {
  isAdminView = false;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminView = event.urlAfterRedirects.includes('/admin');
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  getCartCount(): number {
    return this.cartService.getCartCount();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
