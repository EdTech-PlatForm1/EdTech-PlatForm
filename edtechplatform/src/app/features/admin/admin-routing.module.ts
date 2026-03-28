import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminOrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { UsersComponent } from './components/users/users.component';

import { ManageContentComponent } from './components/manage-content/manage-content.component';

import { CreateProductComponent } from './components/create-product/create-product.component';

import { EditProductComponent } from './components/edit-product/edit-product.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'orders', component: AdminOrdersComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/create', component: CreateProductComponent },
  { path: 'products/edit/:id', component: EditProductComponent },
  { path: 'products/manage/:id', component: ManageContentComponent },
  { path: 'users', component: UsersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
