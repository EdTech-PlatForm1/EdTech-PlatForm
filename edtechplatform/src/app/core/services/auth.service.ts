import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface AuthPayload {
  username?: string;
  email: string;
  password?: string;
  confirmationpassword?: string;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: { username?: string; email?: string; role?: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly endpoint = 'http://localhost:5001/auth';
  private user: { username?: string; email?: string; role?: string } | null = null;

  constructor(private http: HttpClient) {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const userJson = localStorage.getItem('auth_user');
      if (token && userJson) {
        this.user = JSON.parse(userJson);
      }
    }
  }

  login(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.endpoint}/login`, payload).pipe(
      tap((res) => {
        if (res.accessToken && res.user) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('auth_user', JSON.stringify(res.user));
          }
          this.user = res.user;
        }
      }),
      catchError(this.handleError)
    );
  }

  register(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.endpoint}/signup`, {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      confirmationpassword: payload.confirmationpassword
    }).pipe(
      tap((res) => {
        if (res.user) {
          // After signup, user might need to login
          this.user = { email: res.user.email };
        }
      }),
      catchError(this.handleError)
    );
  }

  confirmEmail(email: string, otp: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.endpoint}/confirm-email`, { email, otp }).pipe(
      catchError(this.handleError)
    );
  }


  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth_user');
    }
    this.user = null;
  }

  isAuthenticated(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return !!localStorage.getItem('accessToken');
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  getUser() {
    return this.user || { username: 'Guest', email: '' };
  }

  // Admin User Management
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/users`).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/users/${id}`, userData).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/users/${id}`).pipe(
      catchError(this.handleError)
    );
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
