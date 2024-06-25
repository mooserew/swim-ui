import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  // Add other fields if necessary
}

interface UsernameResponse {
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'https://swim-api-production-1a4b.up.railway.app/Swim/login'; // Backend login URL
  private logoutUrl = 'https://swim-api-production-1a4b.up.railway.app/Swim/logout'; // Backend logout URL

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.loginUrl, loginRequest, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.redirectToIndex();
            // No need to store in localStorage anymore
            // You can handle successful login in the component
          }
        }),
        catchError((error) => {
          console.error('Error:', error);
          // Display error message to the user
          // Example: loginFailToast.toast('show');
          return throwError('Login failed');
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .post<any>(this.logoutUrl, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          // Manually delete the JWT cookie by setting an expired date
          window.location.href = '/login';
          this.deleteCookie('jwt');
          localStorage.clear();
          // Optionally perform other logout actions (clear state, etc.)
        }),
        catchError((error) => {
          console.error('Logout Error:', error);
          return throwError(error);
        })
      );
  }

  isLoggedIn(): boolean {
    return this.getCookie('jwt') !== '';
  }

  redirectToLogin(): void {
    window.location.href = '/login';
  }

  redirectToIndex(): void {
    window.location.href = '/home';
  }

  private deleteCookie(name: string): void {
    document.cookie =
      name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  private getCookie(name: string): string {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return '';
  }

  getUsernameFromToken(): Promise<string> {
    return this.http
      .get<UsernameResponse>('https://swim-api-production-1a4b.up.railway.app/Swim/username', {
        withCredentials: true,
      })
      .toPromise()
      .then((response) => {
        if (response && response.username) {
          return response.username;
        } else {
          throw new Error('Username not found in response');
        }
      })
      .catch((error) => {
        console.error('Error fetching username:', error);
        throw error; // Re-throw the error to be caught by the caller
      });
  }

  exchangeAuthorizationCode(code: string): Observable<any> {
    return this.http.get(`https://swim-api-production-1a4b.up.railway.app/callback?code=${code}`);
  }
}
