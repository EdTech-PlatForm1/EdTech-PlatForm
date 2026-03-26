import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly endpoint = 'http://localhost:4004';

  constructor(private http: HttpClient) {}

  uploadFiles(files: FileList, maxFiles: number = 5): Observable<any> {
    if (files.length > maxFiles) {
      return throwError(() => new Error(`Maximum ${maxFiles} files allowed`));
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    return this.http.post(`${this.endpoint}/api/upload`, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Upload failed.';
    if (error.error && error.error.message) {
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'Connection error.';
    } else if (error.status >= 400 && error.status < 500) {
      message = 'Invalid file or request.';
    }
    return throwError(() => new Error(message));
  }
}