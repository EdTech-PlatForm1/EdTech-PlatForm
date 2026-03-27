import { Component } from '@angular/core';
import { ApiService } from '../../services/api/api';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.html'
})
export class PaymentComponent {

  form = {
    amount: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  constructor(private api: ApiService) {}

  pay() {
    this.api.payment(this.form).subscribe(() => {
      alert("Payment successful 💳");
    });
  }
}
