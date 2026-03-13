import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  memberSince: string;
  savedPlaces: any[];
  favorites: any[];
  visited: any[];
  submissions: any[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getProfile(userId: string): Observable<UserProfile | null> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          console.error('Audit [Profile]: CORS or network error', error);
        } else if (error.status === 404) {
          console.error('Audit [Profile]: User not found (404)', error);
        } else {
          console.error(`Audit [Profile]: HTTP ${error.status}`, error);
        }
        return of(null);
      })
    );
  }
}
