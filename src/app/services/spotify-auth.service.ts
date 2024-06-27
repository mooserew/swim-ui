  import { Injectable } from '@angular/core';
  import { HttpClient, HttpParams } from '@angular/common/http';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root',
  })
  export class SpotifyAuthService {
    private apiUrl = 'https://swim-api-production-1a4b.up.railway.app';

    constructor(private http: HttpClient) {}

    login(): void {
      window.location.href = `${this.apiUrl}/spotify/login`;
    }

    handleCallback(code: string): Observable<any> {
      const params = new HttpParams().set('code', code);
      return this.http.get<any>(`${this.apiUrl}/callback`, { params });
    }

    getUserTopTracks(accessToken: string): Observable<any> {
      const params = new HttpParams().set('accessToken', accessToken);
      return this.http.get<any>(`${this.apiUrl}/user/top-tracks`, { params });
    }

    getUserTopArtists(accessToken: string): Observable<any> {
      const params = new HttpParams().set('accessToken', accessToken);
      return this.http.get<any>(`${this.apiUrl}/user/top-artists`, { params });
    }

    refreshAccessToken(refreshToken: string): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/spotify/refresh-token`, {
        refreshToken,
      });
    }
  }
