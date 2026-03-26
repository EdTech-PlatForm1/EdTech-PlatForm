import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';
import { UploadService } from './services/upload.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [AuthService, ErrorHandlerService, UploadService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
