import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vendors`;

  submitListing(formData: FormData): Observable<any> {
    // Attach JWT token if available (admin or user-submitted listings)
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('user_token');
    const token = adminToken || userToken;
    
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(this.apiUrl, formData, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          console.error('Audit [Submission]: CORS or network error — server may be unreachable', error);
        } else if (error.status === 401) {
          console.error('Audit [Submission]: Unauthorized — JWT token missing or invalid (401)', error);
        } else if (error.status === 500) {
          console.error('Audit [Submission]: Internal server error (500)', error);
        } else {
          console.error(`Audit [Submission]: HTTP ${error.status}`, error);
        }
        const errorMsg = error.error?.error || error.error?.message || error.statusText || 'Connection Refused';
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
