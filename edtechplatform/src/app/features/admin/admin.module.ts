import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminOrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { UsersComponent } from './components/users/users.component';
import { ProfileComponent } from './components/profile/profile.component';

import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: 'test',
  standalone: false
})
export class TestComponent {}

@NgModule({
  declarations: [
    TestComponent,
    ProductsComponent,
    DashboardComponent,
    AdminOrdersComponent,
    UsersComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
