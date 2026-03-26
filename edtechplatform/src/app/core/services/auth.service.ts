import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface AuthPayload {
  name?: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: { name: string; email: string; role?: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly endpoint = 'http://localhost:4004/auth';
  private user: AuthResponse['user'] | null = null;

  constructor(private http: HttpClient) {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const userJson = localStorage.getItem('auth_user');
      if (token && userJson) {
        this.user = JSON.parse(userJson);
      }
    }
  }

  login(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.endpoint}/login`, payload).pipe(
      tap((res) => {
        if (res.accessToken) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('auth_token', res.accessToken);
            // Assuming user info is not sent, or we can decode from token
            // For now, set a basic user object
            const user = { name: payload.email, email: payload.email };
            localStorage.setItem('auth_user', JSON.stringify(user));
          }
          this.user = { name: payload.email, email: payload.email };
        }
      }),
      catchError(this.handleError)
    );
  }

  register(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.endpoint}/signup`, {
      username: payload.name,
      email: payload.email,
      password: payload.password
    }).pipe(
      tap((res) => {
        if (res.user) {
          // After signup, user might need to login
          this.user = { name: res.user.name, email: res.user.email };
        }
      }),
      catchError(this.handleError)
    );
  }


  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    this.user = null;
  }

  isAuthenticated(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return !!localStorage.getItem('auth_token');
  }

  getUser() {
    return this.user || { name: 'Guest', email: '' };
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'خطاء غير متوقع، حاول مرة تانية.';
    if (error.error && error.error.message) {
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'مشكلة في الاتصال بالسيرفر.';
    } else if (error.status >= 400 && error.status < 500) {
      message = 'بيانات غير صحيحة، راجع المدخلات.';
    }
    return throwError(() => new Error(message));
  }
}
