import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CartService } from '../../../core/services/cart.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  isAdminView = false;
  cartCount = 0;

  constructor(private router: Router, private cartService: CartService) {
   
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminView = event.urlAfterRedirects.includes('/admin');
      }
    });
  }

  ngOnInit(): void {
    
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.length;
    });
  }
}