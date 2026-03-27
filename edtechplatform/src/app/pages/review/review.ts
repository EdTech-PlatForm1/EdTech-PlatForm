import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api';

@Component({
  selector: 'app-reviews',
  templateUrl: './review.html',
  styleUrls: ['./review.css']
})
export class ReviewsComponent implements OnInit {

  reviews: any[] = [];
  loading = false;

  form = {
    productId: '',
    rating: 5,
    comment: ''
  };

  constructor(private api: ApiService) {}

ngOnInit(): void {
  localStorage.setItem("token", "Put your Token here")
  this.getReviews();
}
  // Load all reviews
  getReviews() {
    this.loading = true;

    this.api.getReviews().subscribe({
      next: (res: any) => {
        this.reviews = res.reviews;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  //  Add review
  addReview() {
    if (!this.form.productId) {
      alert("Product ID required");
      return;
    }

    this.api.addReview(this.form).subscribe({
      next: () => {
        alert("Review added successfully");
        this.getReviews();
        this.resetForm();
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }

  resetForm() {
    this.form = {
      productId: '',
      rating: 5,
      comment: ''
    };
  }
}
