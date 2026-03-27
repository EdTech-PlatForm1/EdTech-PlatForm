import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private apiUrl = 'http://localhost:4000/order';
  private http = inject(HttpClient);

  constructor() { }

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (typeof localStorage !== 'undefined') {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YzQ0YzI3ZDAzYzExOGY4OWZmMzNiNSIsImVtYWlsIjoidGVzdGVyMUBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc0NDcyMjk4LCJleHAiOjE3NzUwNzcwOTh9.VU-mTdfvAw174hUeh5x54xrDLQDwITVbTjAm3xzrlyc"
      // const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
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
