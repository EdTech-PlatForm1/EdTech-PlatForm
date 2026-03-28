import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api/api';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class PaymentComponent {

  form = {
    amount: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  constructor(private api: ApiService) { }

  pay() {
    this.api.payment(this.form).subscribe({
      next: () => {
        alert("Payment successful 💳");
      },
      error: (err) => {
        alert(err.error?.message || 'Payment failed.');
      }
    });
  }
}
