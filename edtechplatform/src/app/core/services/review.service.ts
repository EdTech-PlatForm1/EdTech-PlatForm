import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Review {
  _id?: string;
  productId: string;
  userId?: { _id: string, username: string };
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly endpoint = 'http://localhost:5001/review';

  constructor(private http: HttpClient) {}

  addReview(productId: string, rating: number, comment: string): Observable<any> {
    return this.http.post(`${this.endpoint}/addreview`, { productId, rating, comment }).pipe(
      catchError(this.handleError)
    );
  }

  getAllReviews(): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/getallreview`).pipe(
      catchError(this.handleError)
    );
  }

  getSingleReview(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.endpoint}/getsinglereview/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateReview(id: string, reviewData: Partial<Review>): Observable<any> {
    return this.http.put(`${this.endpoint}/updatedreview/${id}`, reviewData).pipe(
      catchError(this.handleError)
    );
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.endpoint}/deletereview/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error?.message || 'Review operation failed'));
  }
}
