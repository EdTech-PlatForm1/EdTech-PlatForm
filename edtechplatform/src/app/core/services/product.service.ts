import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Product {
  _id: string;
  productName: string;
  price: number;
  description: string;
  images: string[];
  tutorials: any[];
  challenges: any[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = 'http://localhost:4000/product';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<{ products?: Product[], getallProduct?: Product[] }>(`${this.endpoint}/getAll`).pipe(
      map(res => res.products || res.getallProduct || []),
      catchError(this.handleError)
    );
  }

  getSingleProduct(id: string): Observable<Product> {
    return this.http.get<{ product: Product }>(`${this.endpoint}/get/${id}`).pipe(
      map(res => res.product),
      catchError(this.handleError)
    );
  }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.endpoint}/create`, formData).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.endpoint}/update/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  softDeleteProduct(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/softDelete/${id}`, {}).pipe(
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