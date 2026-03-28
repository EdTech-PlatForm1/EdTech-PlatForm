import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { UserDataService } from '../../core/services/user-data.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  user: any;
  hasPurchased = false;
  stats = {
    tutorials: 0,
    challenges: 0,
    orders: 0
  };
  isLoading = true;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private userDataService: UserDataService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Fetch all related data to determine stats and purchased state
    forkJoin({
      orders: this.orderService.getUserOrderHistory(),
      tutorials: this.userDataService.getUserTutorials(),
      challenges: this.userDataService.getUserChallenges()
    }).subscribe({
      next: (res: any) => {
        const orders = res.orders || [];
        const tutorialsList = res.tutorials?.tutorials || [];
        const challengesList = res.challenges?.challenges || [];

        this.stats.orders = orders.length;

        // Count total tutorials across all products
        this.stats.tutorials = tutorialsList.reduce((sum: number, course: any) => sum + (course.tutorials?.length || 0), 0);
        this.stats.challenges = challengesList.reduce((sum: number, course: any) => sum + (course.challenges?.length || 0), 0);
        
        this.hasPurchased = this.stats.orders > 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.isLoading = false;
      }
    });
  }
}
