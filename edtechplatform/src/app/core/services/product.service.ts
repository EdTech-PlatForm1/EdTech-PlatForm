import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  tutorials: Tutorial[];
  challenges: Challenge[];
  createdAt: string;
  updatedAt: string;
}

export interface Tutorial {
  title: string;
  description: string;
  url?: string;
}

export interface Challenge {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = 'http://localhost:4004';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.endpoint}/api/getAllProducts`).pipe(
      catchError(this.handleError)
    );
  }

  getSingleProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.endpoint}/api/getProduct/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.endpoint}/api/createproducts`, formData).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.endpoint}/api/updateProducts/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  softDeleteProduct(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/api/softDeleteProducts/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'An unexpected error occurred.';
    if (error.error && error.error.message) {
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'Connection error.';
    } else if (error.status >= 400 && error.status < 500) {
      message = 'Invalid data provided.';
    }
    return throwError(() => new Error(message));
  }
}