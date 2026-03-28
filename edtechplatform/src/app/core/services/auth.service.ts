import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface AuthResponse {
  message: string;
  accessToken?: string;
  user?: { name?: string; email?: string; role?: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly endpoint = 'http://localhost:4000/auth';
  private user: AuthResponse['user'] | null = null;

  constructor(private http: HttpClient) {
    if (typeof localStorage !== 'undefined') {
      const userJson = localStorage.getItem('auth_user');
      if (userJson) {
        this.user = JSON.parse(userJson);
      }
    }
  }

  getUser() {
    return this.user || { name: 'Guest', email: '' };
  }

  isAuthenticated(): boolean {
    return !!(typeof localStorage !== 'undefined' && localStorage.getItem('accessToken'));
  }

  login(payload: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.endpoint}/login`, payload).pipe(
      tap(res => {
        if (res.accessToken && res.user) {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('auth_user', JSON.stringify(res.user));
          this.user = res.user;
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error?.message || 'Authentication error.'));
  }
}
