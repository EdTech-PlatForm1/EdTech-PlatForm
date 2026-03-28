import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  getReviews() {
    return this.http.get(`${this.baseUrl}/reviews`);
  }

  addReview(data: any) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/reviews`, data, { headers });
  }

  payment(data: any) {
    return this.http.post(`${this.baseUrl}/orders`, data);
  }
}
