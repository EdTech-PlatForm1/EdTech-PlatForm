import { Component, OnInit, inject } from '@angular/core';
import { UserDataService } from '../../core/services/user-data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  private userDataService = inject(UserDataService);
  orders: any[] = [];
  isLoading = true;
  error = '';

  ngOnInit() {
    this.userDataService.getUserOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders || res.results || res || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load orders or you have no orders yet.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
