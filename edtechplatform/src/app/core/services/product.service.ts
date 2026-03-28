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
  discount: number;
  stock: number;
  category: string;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = 'http://localhost:5001/product';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<{ products?: Product[], getallProduct?: Product[], allProducts?: Product[] }>(`${this.endpoint}/getAll`).pipe(
      map(res => res.products || res.getallProduct || res.allProducts || []),
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

  restoreProduct(id: string): Observable<any> {
    return this.http.patch(`${this.endpoint}/restore/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  hardDeleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.endpoint}/hardDelete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Tutorial Management
  addTutorial(productId: string, tutorialData: any): Observable<any> {
    return this.http.post(`${this.endpoint}/addTutorial/${productId}`, tutorialData).pipe(
      catchError(this.handleError)
    );
  }

  updateTutorial(productId: string, tutorialId: string, tutorialData: any): Observable<any> {
    return this.http.patch(`${this.endpoint}/updateTutorial/${productId}/${tutorialId}`, tutorialData).pipe(
      catchError(this.handleError)
    );
  }

  deleteTutorial(productId: string, tutorialId: string): Observable<any> {
    return this.http.delete(`${this.endpoint}/deleteTutorial/${productId}/${tutorialId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Challenge Management
  addChallenge(productId: string, challengeData: any): Observable<any> {
    return this.http.post(`${this.endpoint}/addChallenge/${productId}`, challengeData).pipe(
      catchError(this.handleError)
    );
  }

  updateChallenge(productId: string, challengeId: string, challengeData: any): Observable<any> {
    return this.http.patch(`${this.endpoint}/updateChallenge/${productId}/${challengeId}`, challengeData).pipe(
      catchError(this.handleError)
    );
  }

  deleteChallenge(productId: string, challengeId: string): Observable<any> {
    return this.http.delete(`${this.endpoint}/deleteChallenge/${productId}/${challengeId}`).pipe(
      catchError(this.handleError)
    );
  }

  solveChallenge(productId: string, challengeId: string, result: any): Observable<any> {
    return this.http.post(`${this.endpoint}/solvechallenges/${productId}/${challengeId}`, result).pipe(
      catchError(this.handleError)
    );
  }

  // Retrieval
  getChallengesByProduct(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/challenges/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getTutorialsByProduct(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/Tutorials/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getChallengesForUser(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/userProductChallenges/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

  getTutorialsForUser(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/userProductTutorials/${productId}`).pipe(
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