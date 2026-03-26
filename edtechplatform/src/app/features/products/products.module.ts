import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CreateOrderComponent } from './create-order/create-order.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailsComponent,
    CreateOrderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }