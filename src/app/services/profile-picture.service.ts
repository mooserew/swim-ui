import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {
  private baseUrl = 'https://swim-api-production-1a4b.up.railway.app/Swim';
  private defaultProfilePicture = 'default.png'; // Path to default image in assets

  constructor(private http: HttpClient) {}

  getProfilePictureUrl(userId: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/user/profile-picture/${userId}`, {
      responseType: 'text',
      withCredentials: true
    }).pipe(
      map((url: string) => {
        const timestamp = new Date().getTime();
        return `${url}?t=${timestamp}`;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching profile picture:', error);
        return of(this.defaultProfilePicture);
      })
    );
  }
}
