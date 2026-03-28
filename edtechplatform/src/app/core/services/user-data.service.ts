import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private apiUrl = 'http://localhost:5001/order';
  private http = inject(HttpClient);

  constructor() { }

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  getUserOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`, { headers: this.getAuthHeaders() });
  }

  getUserTutorials(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tutorials`, { headers: this.getAuthHeaders() });
  }

  getUserChallenges(): Observable<any> {
    return this.http.get(`${this.apiUrl}/challenges`, { headers: this.getAuthHeaders() });
  }
}
